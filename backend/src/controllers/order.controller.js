import mongoose from "mongoose";

import { BookPost } from "../models/BookPost.js";
import { Order } from "../models/Order.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const orderPopulate = [
  { path: "bookPost", select: "type title author category condition frontImage officialBook price isNegotiable wantedBook status location" },
  { path: "seller", select: "name username avatar location" },
  { path: "buyer", select: "name username avatar location" },
  { path: "statusHistory.changedBy", select: "name username" },
];

function validateContactInfo(info, label) {
  if (!info?.contactName?.trim()) return `${label} contact name is required`;
  if (!info?.phone?.trim()) return `${label} phone is required`;
  if (!info?.division?.trim()) return `${label} division is required`;
  if (!info?.district?.trim()) return `${label} district is required`;
  if (!info?.upazila?.trim()) return `${label} upazila or thana is required`;
  if (!info?.area?.trim()) return `${label} area is required`;
  if (!info?.address?.trim()) return `${label} address is required`;
  return "";
}

function validateExchangeRequest(payload) {
  if (!payload.buyerProposedBook?.title?.trim()) return "Proposed book title is required";
  if (!payload.buyerProposedBook?.author?.trim()) return "Proposed book author is required";
  if (!payload.buyerProposedBook?.condition?.trim()) return "Proposed book condition is required";
  if (!Array.isArray(payload.buyerProposedBook?.photos) || payload.buyerProposedBook.photos.length < 1) {
    return "At least one proposed book photo is required";
  }

  return "";
}

function getInitialStatus(type) {
  return type === "exchange" ? "requested" : "admin_review";
}

async function populateOrder(order) {
  return order.populate(orderPopulate);
}

export const createOrder = asyncHandler(async (req, res) => {
  const { bookPostId, buyerDeliveryInfo, buyerProposedBook } = req.body;

  if (!mongoose.isValidObjectId(bookPostId)) {
    res.status(400);
    throw new Error("Invalid book post id");
  }

  const deliveryError = validateContactInfo(buyerDeliveryInfo, "Delivery");

  if (deliveryError) {
    res.status(400);
    throw new Error(deliveryError);
  }

  const bookPost = await BookPost.findOne({ _id: bookPostId, status: "active" }).select("+pickupInfo");

  if (!bookPost) {
    res.status(404);
    throw new Error("Book post not found");
  }

  if (bookPost.owner.equals(req.user._id)) {
    res.status(400);
    throw new Error("You cannot order your own book");
  }

  if (!bookPost.pickupInfo) {
    res.status(400);
    throw new Error("Seller pickup information is missing for this post");
  }

  if (bookPost.type === "exchange") {
    const exchangeError = validateExchangeRequest({ buyerProposedBook });

    if (exchangeError) {
      res.status(400);
      throw new Error(exchangeError);
    }
  }

  const status = getInitialStatus(bookPost.type);
  const order = await Order.create({
    type: bookPost.type,
    bookPost: bookPost._id,
    seller: bookPost.owner,
    buyer: req.user._id,
    sellerPickupInfo: bookPost.pickupInfo,
    buyerDeliveryInfo,
    buyerProposedBook: bookPost.type === "exchange" ? buyerProposedBook : undefined,
    status,
    statusHistory: [
      {
        status,
        note: bookPost.type === "exchange" ? "Exchange request sent to seller" : "Sell order sent to admin review",
        changedBy: req.user._id,
      },
    ],
  });

  await populateOrder(order);

  res.status(201).json({
    success: true,
    data: order,
  });
});

export const listMyOrders = asyncHandler(async (req, res) => {
  const [buying, selling] = await Promise.all([
    Order.find({ buyer: req.user._id }).populate(orderPopulate).sort({ createdAt: -1 }),
    Order.find({ seller: req.user._id }).populate(orderPopulate).sort({ createdAt: -1 }),
  ]);

  res.json({
    success: true,
    data: {
      buying,
      selling,
    },
  });
});

export const getOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(orderPopulate);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const isParticipant = order.buyer._id.equals(req.user._id) || order.seller._id.equals(req.user._id);

  if (!isParticipant && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You cannot view this order");
  }

  res.json({
    success: true,
    data: order,
  });
});

export const updateSellerDecision = asyncHandler(async (req, res) => {
  const { decision, note } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  if (!order.seller.equals(req.user._id)) {
    res.status(403);
    throw new Error("Only the seller can decide this request");
  }

  if (order.type !== "exchange") {
    res.status(400);
    throw new Error("Seller decision is only needed for exchange requests");
  }

  if (!["accepted", "rejected"].includes(decision)) {
    res.status(400);
    throw new Error("Decision must be accepted or rejected");
  }

  order.sellerDecision = {
    status: decision,
    note,
    decidedAt: new Date(),
  };
  order.status = decision === "accepted" ? "admin_review" : "seller_rejected";
  order.statusHistory.push({
    status: order.status,
    note,
    changedBy: req.user._id,
  });
  await order.save();
  await populateOrder(order);

  res.json({
    success: true,
    data: order,
  });
});

export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const canCancel = order.buyer.equals(req.user._id) || order.seller.equals(req.user._id) || req.user.role === "admin";

  if (!canCancel) {
    res.status(403);
    throw new Error("You cannot cancel this order");
  }

  if (["delivered", "cancelled"].includes(order.status)) {
    res.status(400);
    throw new Error("This order can no longer be cancelled");
  }

  order.status = "cancelled";
  order.statusHistory.push({
    status: "cancelled",
    note: req.body.note,
    changedBy: req.user._id,
  });
  await order.save();
  await populateOrder(order);

  res.json({
    success: true,
    data: order,
  });
});

export const listAdminOrders = asyncHandler(async (req, res) => {
  const filter = {};

  if (req.query.status) filter.status = req.query.status;
  if (req.query.type) filter.type = req.query.type;

  const orders = await Order.find(filter).populate(orderPopulate).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: orders,
  });
});

export const updateAdminOrderStatus = asyncHandler(async (req, res) => {
  const allowedStatuses = [
    "admin_review",
    "pickup_assigned",
    "picked_up",
    "out_for_delivery",
    "delivered",
    "cancelled",
  ];
  const { status, note, adminNote, deliveryAgent } = req.body;

  if (!allowedStatuses.includes(status)) {
    res.status(400);
    throw new Error("Invalid admin order status");
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  order.status = status;
  if (adminNote !== undefined) order.adminNote = adminNote;
  if (deliveryAgent !== undefined) order.deliveryAgent = deliveryAgent;
  order.statusHistory.push({
    status,
    note,
    changedBy: req.user._id,
  });

  await order.save();

  if (status === "delivered") {
    await BookPost.updateOne(
      { _id: order.bookPost },
      { status: order.type === "exchange" ? "exchanged" : "sold" },
    );
  }

  if (status === "cancelled") {
    await BookPost.updateOne({ _id: order.bookPost, status: { $ne: "active" } }, { status: "active" });
  }

  await populateOrder(order);

  res.json({
    success: true,
    data: order,
  });
});

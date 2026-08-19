import { BookPost } from "../models/BookPost.js";
import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function ensureParticipant(conversation, userId) {
  return conversation.participants.some((participant) => participant.equals(userId));
}

export const listConversations = asyncHandler(async (req, res) => {
  const conversations = await Conversation.find({
    participants: req.user._id,
    archivedBy: { $ne: req.user._id },
  })
    .populate("buyer", "name username avatar location")
    .populate("seller", "name username avatar location")
    .populate("bookPost", "title author type status frontImage price isNegotiable wantedBook")
    .sort({ lastMessageAt: -1, updatedAt: -1 });

  res.json({
    success: true,
    data: conversations,
  });
});

export const createOrGetConversation = asyncHandler(async (req, res) => {
  const { bookPostId } = req.body;
  const bookPost = await BookPost.findById(bookPostId);

  if (!bookPost) {
    res.status(404);
    throw new Error("Book post not found");
  }

  if (bookPost.owner.equals(req.user._id)) {
    res.status(400);
    throw new Error("You cannot start a conversation with your own post");
  }

  const conversation = await Conversation.findOneAndUpdate(
    {
      buyer: req.user._id,
      seller: bookPost.owner,
      bookPost: bookPost._id,
    },
    {
      buyer: req.user._id,
      seller: bookPost.owner,
      bookPost: bookPost._id,
      participants: [req.user._id, bookPost.owner],
      $addToSet: { readBy: req.user._id },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  )
    .populate("buyer", "name username avatar location")
    .populate("seller", "name username avatar location")
    .populate("bookPost", "title author type status frontImage price isNegotiable wantedBook");

  res.status(201).json({
    success: true,
    data: conversation,
  });
});

export const listMessages = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || !ensureParticipant(conversation, req.user._id)) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const messages = await Message.find({
    conversation: conversation._id,
    deletedFor: { $ne: req.user._id },
  })
    .populate("sender", "name username avatar")
    .sort({ createdAt: 1 });

  res.json({
    success: true,
    data: messages,
  });
});

export const sendMessage = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || !ensureParticipant(conversation, req.user._id)) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  const text = req.body.text?.trim();

  if (!text && req.body.type !== "image") {
    res.status(400);
    throw new Error("Message text is required");
  }

  const message = await Message.create({
    conversation: conversation._id,
    sender: req.user._id,
    type: req.body.type || "text",
    text,
    attachments: req.body.attachments || [],
    readBy: [req.user._id],
  });

  conversation.lastMessage = message.text || "Attachment";
  conversation.lastMessageAt = message.createdAt;
  conversation.readBy = [req.user._id];
  await conversation.save();

  await message.populate("sender", "name username avatar");
  await conversation.populate("buyer", "name username avatar location");
  await conversation.populate("seller", "name username avatar location");
  await conversation.populate("bookPost", "title author type status frontImage price isNegotiable wantedBook");

  const payload = {
    conversation,
    message,
  };
  const io = req.app.get("io");

  io?.to(`conversation:${conversation._id}`).emit("message:new", payload);
  conversation.participants.forEach((participantId) => {
    io?.to(`user:${participantId}`).emit("conversation:updated", payload);
  });

  res.status(201).json({
    success: true,
    data: message,
  });
});

export const markConversationRead = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id);

  if (!conversation || !ensureParticipant(conversation, req.user._id)) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  await Conversation.updateOne({ _id: conversation._id }, { $addToSet: { readBy: req.user._id } });
  await Message.updateMany({ conversation: conversation._id }, { $addToSet: { readBy: req.user._id } });

  res.json({
    success: true,
    message: "Conversation marked as read",
  });
});

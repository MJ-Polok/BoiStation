import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import { Conversation } from "../models/Conversation.js";
import { User } from "../models/User.js";
import { getAllowedOrigins } from "../config/cors.js";

export function initSocket(httpServer) {
  const allowedOrigins = getAllowedOrigins();
  const io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        throw new Error("Authentication required");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("_id name username");

      if (!user) {
        throw new Error("User not found");
      }

      socket.user = user;
      next();
    } catch {
      next(new Error("Authentication required"));
    }
  });

  io.on("connection", (socket) => {
    socket.join(`user:${socket.user._id}`);

    socket.on("conversation:join", async (conversationId) => {
      const normalizedId = conversationId.replace(/^conversation:/, "");
      const conversation = await Conversation.findOne({
        _id: normalizedId,
        participants: socket.user._id,
      }).select("_id");

      if (!conversation) {
        return;
      }

      socket.join(`conversation:${conversation._id}`);
    });

    socket.on("conversation:leave", (conversationId) => {
      const normalizedId = conversationId.replace(/^conversation:/, "");
      socket.leave(`conversation:${normalizedId}`);
    });
  });

  return io;
}




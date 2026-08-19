import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import bookSearchRoutes from "./routes/bookSearch.routes.js";
import bookRoutes from "./routes/book.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import orderRoutes from "./routes/order.routes.js";
import savedRoutes from "./routes/saved.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import userRoutes from "./routes/user.routes.js";
import { errorHandler, notFound } from "./middleware/error.middleware.js";

export function createApp() {
  const app = express();
  const allowedOrigins = [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ];

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }

        callback(new Error("Not allowed by CORS"));
      },
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  if (process.env.NODE_ENV !== "test") {
    app.use(morgan("dev"));
  }

  app.get("/api/health", (req, res) => {
    res.json({
      success: true,
      message: "Boi Station API is running",
    });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/book-search", bookSearchRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/saved", savedRoutes);
  app.use("/api/conversations", conversationRoutes);
  app.use("/api/orders", orderRoutes);
  app.use("/api/uploads", uploadRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

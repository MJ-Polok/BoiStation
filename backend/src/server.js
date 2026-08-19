import "dotenv/config";
import http from "http";

import { createApp } from "./app.js";
import { connectDB } from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { initSocket } from "./socket/index.js";

const port = process.env.PORT || 5000;
const app = createApp();
const server = http.createServer(app);

configureCloudinary();
const io = initSocket(server);
app.set("io", io);

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Boi Station API listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  });

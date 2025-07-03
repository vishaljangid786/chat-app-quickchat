import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import { Server } from "socket.io";

// Create express app and http server
const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://chat-app-olive-omega.vercel.app", // deployed frontend
];

// Setup Socket.IO
export const io = new Server(server, {
  cors: {
    origin: allowedOrigins[1], // production frontend only
    credentials: true,
  },
});

// Store online users
export const userSocketMap = {};

// Socket.IO connection
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("user Connected ", userId);

  if (userId) userSocketMap[userId] = socket.id;

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user Disconnected ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));

// Fixed CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Routes
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB
await connectDB();

// Start server (non-production only; Vercel uses serverless handler)
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log("Server is running on port:", PORT));
}

// Export for Vercel
export default server;

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

// Setup Socket.IO
export const io = new Server(server, {
  cors: {
    origin: "https://chat-app-olive-omega.vercel.app",
    credentials: true,
  },
});


// store online users
export const userSocketMap = {};

// socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  console.log("user Connected ", userId);

  if (userId) userSocketMap[userId] = socket.id;

  //  emit online users to all connected clents
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("user Disconnected ", userId);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Middleware setup
app.use(express.json({ limit: "4mb" }));
const allowedOrigins = ["https://chat-app-olive-omega.vercel.app"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Optional, if you're using cookies/auth headers
  })
);


// routes setup
app.use("/api/status", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// connect to mongodb
await connectDB();

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log("Server is running on port: ", PORT));
}

// export server for vercel
export default server;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./db");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const logRoutes = require("./routes/logRoutes");
const { setSocketServer } = require("./sockets/socketHandler");

dotenv.config();

// Express app init
const app = express();

// MongoDB Connect
connectDB().catch((err) => {
  console.error("❌ MongoDB connection error:", err.message);
  process.exit(1); // Stop server if DB fails
});

// Create HTTP server for socket
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// Initialize socket logic
setSocketServer(io);

// Middlewares
app.use(cors());
app.use(express.json());

// Basic health route
app.get("/", (req, res) => {
  res.send("✅ API is working!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logRoutes);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const express = require("express");
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

const app = express();
const server = http.createServer(app);

// ✅ Frontend hosted on Vercel
const FRONTEND_ORIGIN = "https://mern-kanban-board-sable.vercel.app";

// ✅ Connect to MongoDB
connectDB().then(() => console.log("✅ MongoDB connected successfully"));

// ✅ CORS middleware
app.use(cors({
  origin: FRONTEND_ORIGIN,
  credentials: true,
}));
app.use(express.json());

// ✅ Handle preflight requests properly
app.options("*", cors());

// ✅ API routes
app.get("/", (req, res) => {
  res.send("✅ API is working!");
});
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/logs", logRoutes);

// ✅ Socket.IO setup with correct CORS
const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }
});
setSocketServer(io);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

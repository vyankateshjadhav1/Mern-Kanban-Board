import { io } from "socket.io-client";

const socket = io("https://taskflow-yjut.onrender.com", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

export default socket;
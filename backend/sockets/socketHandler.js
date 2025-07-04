function setSocketServer(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    //  TASK CREATED
    socket.on("task-created", (task) => {
      console.log(" Broadcasting: task-created");
      io.emit("task-created", task); // send to ALL clients
    });

    //  TASK UPDATED
    socket.on("task-updated", (task) => {
      console.log(" Broadcasting: task-updated");
      io.emit("task-updated", task); // send to ALL clients
    });

    //  TASK DELETED
    socket.on("task-deleted", (taskId) => {
      console.log(" Broadcasting: task-deleted");
      io.emit("task-deleted", taskId); // send to ALL clients
    });

    //  DISCONNECT
    socket.on("disconnect", () => {
      console.log(" Client disconnected:", socket.id);
    });
  });
}

module.exports = { setSocketServer };
import { useState } from "react";
import API from "../api/axios";
import socket from "../api/socket";
import TaskCard from "./TaskCard";
import { FiColumns } from "react-icons/fi";

export default function Column({ status, tasks, onTaskUpdate }) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleTaskUpdate = () => {
    onTaskUpdate?.();
  };

  const handleTaskDelete = (taskId) => {
    onTaskUpdate?.();
  };

  const onDrop = async (e) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    try {
      const res = await API.put(`/api/tasks/${taskId}`, { status });
      socket.emit("task-updated", res.data);
      handleTaskUpdate();
    } catch (err) {
      console.error("Drag-drop update failed", err);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const onDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <div
      className={`column ${isDraggingOver ? "drop-target" : ""}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <div className="column-header">
        <h3 className="column-title">
          <FiColumns style={{ marginRight: '8px' }} />
          {status}
        </h3>
        <span className="column-count">{tasks.length} tasks</span>
      </div>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onTaskUpdate={handleTaskUpdate}
            onTaskDelete={handleTaskDelete}
          />
        ))}
      </div>
    </div>
  );
}
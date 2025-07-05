import { useEffect, useState } from "react";
import API from "../api/axios";
import socket from "../api/socket";
import Column from "../components/Column";
import ActivityLog from "../components/ActivityLog";
import { FiLogOut, FiPlus, FiClipboard } from "react-icons/fi";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Todo",
    dueDate: ""
  });

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks");
      console.log(" Tasks fetched:", res.data);
      setTasks([...res.data]);
    } catch (err) {
      console.error(" Failed to fetch tasks", err);
    }
  };

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTask.title) return alert("Title is required");
    try {
      const res = await API.post("/api/tasks", newTask);
      socket.emit("task-created", res.data);
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        status: "Todo",
        dueDate: ""
      });
    } catch (err) {
  console.error("❌ Task creation error:", err.response?.data || err.message);
  alert("Task creation failed");
}
  };

  useEffect(() => {
    fetchTasks();

    socket.on("task-created", (data) => {
      console.log(" task-created received", data);
      fetchTasks();
    });

    socket.on("task-updated", (data) => {
      console.log(" task-updated received", data);
      fetchTasks();
    });

    socket.on("task-deleted", (data) => {
      console.log(" task-deleted received", data);
      fetchTasks();
    });

    return () => {
      socket.off("task-created");
      socket.off("task-updated");
      socket.off("task-deleted");
    };
  }, []);

  const statuses = ["Todo", "In Progress", "Done"];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          <FiClipboard /> TaskFlow Dashboard
        </h1>
        <button
          className="btn-logout"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
          }}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <div className="form-container">
        <form onSubmit={createTask}>
          <div className="form-grid">
            <div className="input-group">
              <label>Task Title</label>
              <input
                type="text"
                placeholder="Enter task title"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                required
              />
            </div>
            
            <div className="input-group">
              <label>Priority</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div className="input-group">
              <label>Due Date</label>
              <input
                type="date"
                value={newTask.dueDate}
                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
              />
            </div>
          </div>
          
          <div className="input-group">
            <label>Description</label>
            <input
              type="text"
              placeholder="Enter task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          
          <div className="form-footer">
            <button type="submit" className="btn-primary">
              <FiPlus /> Add Task
            </button>
          </div>
        </form>
      </div>

      <div className="board">
        {statuses.map((status) => (
          <Column
            key={status}
            status={status}
            tasks={tasks.filter((t) => t.status === status)}
            onStatusChange={fetchTasks}
          />
        ))}
      </div>

      <ActivityLog />
    </div>
  );
}
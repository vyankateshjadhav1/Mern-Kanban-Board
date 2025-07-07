import { useState, useEffect } from "react";
import API from "../api/axios";
import socket from "../api/socket";
import { FiEdit2, FiTrash2, FiUserPlus, FiCalendar, FiSave, FiX } from "react-icons/fi";

export default function TaskCard({ task, onTaskUpdate, onTaskDelete }) {
  const [editing, setEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    dueDate: ""
  });

  const [conflictData, setConflictData] = useState(null);
  const [showConflictModal, setShowConflictModal] = useState(false);

  // Initialize form data when task changes
  useEffect(() => {
    setEditedTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
    });
  }, [task]);

  const handleSmartAssign = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await API.post(`/tasks/${task._id}/smart-assign`);
      socket.emit("task-updated", res.data);
      onTaskUpdate?.();
    } catch (err) {
      console.error("Smart assign failed", err);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await API.put(`/tasks/${task._id}`, {
        ...editedTask,
        updatedAt: task.updatedAt,
      });
      socket.emit("task-updated", res.data);
      setEditing(false);
      setConflictData(null);
      setShowConflictModal(false);
      onTaskUpdate?.();
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictData(err.response.data.current);
        setShowConflictModal(true);
      } else {
        console.error("Task update failed", err);
      }
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await API.delete(`/tasks/${task._id}`);
      socket.emit("task-deleted", task._id);
      onTaskDelete?.(task._id);
    } catch (err) {
      console.error("Task deletion failed", err);
    }
  };

  const handleDragStart = (e) => {
    if (editing || e.target.closest('button, input, textarea, select, .task-actions')) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("taskId", task._id);
  };

  const cancelEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setEditing(false);
    // Reset to original task values
    setEditedTask({
      title: task.title,
      description: task.description || "",
      priority: task.priority || "Medium",
      dueDate: task.dueDate ? task.dueDate.slice(0, 10) : ""
    });
  };

  if (editing) {
    return (
      <div 
        className={`task-card edit-mode task-card-${editedTask.priority.toLowerCase()}`}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleUpdate}>
          <div className="input-group">
            <label htmlFor="task-title">Task Title</label>
            <input
              id="task-title"
              type="text"
              value={editedTask.title}
              onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
              placeholder="Enter task title"
              required
              autoFocus
            />
          </div>

          <div className="input-group">
            <label htmlFor="task-description">Description</label>
            <textarea
              id="task-description"
              value={editedTask.description}
              onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
              placeholder="Enter task description"
              rows="3"
            />
          </div>

          <div className="input-group">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={editedTask.priority}
              onChange={(e) => setEditedTask({...editedTask, priority: e.target.value})}
              required
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="task-due-date">
              <FiCalendar style={{ marginRight: "8px" }} />
              Due Date
            </label>
            <input
              id="task-due-date"
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({...editedTask, dueDate: e.target.value})}
              min={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="task-actions">
            <button 
              type="submit"
              className="task-btn task-btn-save"
            >
              <FiSave /> Save
            </button>
            <button 
              type="button"
              className="task-btn task-btn-cancel"
              onClick={cancelEdit}
            >
              <FiX /> Cancel
            </button>
          </div>
        </form>

        {showConflictModal && (
          <div className="conflict-modal">
            <h4>Conflict Detected</h4>
            <p>This task was updated by someone else.</p>
            <div className="modal-section">
              <h5>Your Changes</h5>
              <pre>{JSON.stringify(editedTask, null, 2)}</pre>
            </div>
            <div className="modal-section">
              <h5>Server Version</h5>
              <pre>{JSON.stringify(conflictData, null, 2)}</pre>
            </div>
            <div className="modal-actions">
              <button onClick={() => {
                setEditedTask(conflictData);
                setShowConflictModal(false);
              }}>
                Use Server Version
              </button>
              <button onClick={(e) => {
                setShowConflictModal(false);
                handleUpdate(e);
              }}>
                Use My Changes
              </button>
              <button onClick={() => setShowConflictModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`task-card task-card-${task.priority.toLowerCase()}`}
      draggable={!editing}
      onDragStart={handleDragStart}
    >
      <div className="task-card-header">
        <h4 className="task-title">{task.title}</h4>
        <span className={`task-priority priority-${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </div>

      {task.description && <p className="task-description">{task.description}</p>}

      <div className="task-footer">
        <div>
          {task.assignedTo?.name && (
            <span className="task-assignee">👤 {task.assignedTo.name}</span>
          )}
          {task.dueDate && (
            <p className={new Date(task.dueDate) < new Date() ? "overdue" : ""}>
              <FiCalendar className="task-icon" />
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="task-actions">
          <button 
            className="task-btn task-btn-smart" 
            onClick={handleSmartAssign} 
            title="Smart Assign"
          >
            <FiUserPlus />
          </button>
          <button 
            className="task-btn task-btn-edit" 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setEditing(true);
            }} 
            title="Edit Task"
          >
            <FiEdit2 />
          </button>
          <button 
            className="task-btn task-btn-delete" 
            onClick={handleDelete} 
            title="Delete Task"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import API from "../api/axios"; // ✅ baseURL includes /api
import { FiActivity, FiClock } from "react-icons/fi";

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const res = await API.get("/logs/recent"); // ✅ This becomes /api/logs/recent
      setLogs(res.data);
    } catch (err) {
      console.error("Failed to fetch activity logs", err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="activity-log floating">
      <div className="activity-log-header">
        <h3 className="activity-log-title">
          <FiActivity /> Recent Activity
        </h3>
      </div>
      <ul className="activity-log-list">
        {logs.map((log) => (
          <li key={log._id} className="activity-log-item">
            <FiClock className="activity-log-icon" />
            <span>
              <strong>{log.user?.name || "Someone"}</strong> {log.action}
            </span>
            <span style={{ marginLeft: 'auto', color: 'var(--text-secondary)' }}>
              {new Date(log.timestamp).toLocaleTimeString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

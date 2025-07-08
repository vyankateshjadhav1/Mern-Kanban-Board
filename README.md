
# 🧠 TaskFlow – Real-Time Collaborative Kanban Board

TaskFlow is a real-time collaborative Kanban board built with the MERN stack. It allows multiple users to manage tasks efficiently with features like smart task assignment, conflict resolution, drag-and-drop updates, and real-time synchronization using sockets.

---

## 🚀 Project Overview

TaskFlow provides users with a modern and intuitive interface for managing tasks. It includes powerful features such as:
- Real-time task updates using Socket.IO
- Smart Assign to distribute tasks fairly among team members
- Conflict Handling when multiple users edit the same task
- Drag-and-drop task status updates
- Activity log tracking all actions
- Simple login/register system with JWT authentication

---

## 🛠 Tech Stack Used

### Frontend:
- React.js (with Vite)
- Socket.IO-client
- Axios
- React Router
- Custom CSS (No frameworks used)

### Backend:
- Node.js + Express.js
- MongoDB (with Mongoose)
- Socket.IO (for real-time)
- JSON Web Tokens (JWT)
- dotenv

---

## ⚙️ Setup & Installation

### 1. Clone the Repo
```bash
git clone https://github.com/vyankateshjadhav1/Mern-Kanban-Board.git
cd taskflow-kanban
```

### 2. Setup Backend
```bash
cd backend
npm install
# Create .env file inside /backend with following:
# PORT=5000
# MONGO_URI=<your_mongodb_connection_string>
# JWT_SECRET=superSecretThugKey

npm run dev
```
Server will run on `http://localhost:5000`

### 3. Setup Frontend
```bash
cd ../frontend
npm install
npm run dev
```
Frontend will run on `http://localhost:5173` (or as shown)

---

## ✅ Features & Usage

### 🔐 Authentication
- User can register and login using email/password
- JWT stored in localStorage

### 📋 Kanban Board
- Tasks are grouped into Todo, In Progress, and Done columns
- Drag tasks across columns to update status

### ⚡ Real-Time Updates
- All updates (create/edit/delete/move) are reflected live for all users
- Powered by Socket.IO

### 🎯 Smart Assign
- Automatically assigns task to user with the least active (non-Done) tasks

### ⚠️ Conflict Handling
- If two users edit the same task at the same time:
  - A modal shows both versions
  - User can choose to Use Server, Use My Changes, or Cancel

### 📅 Due Dates & Priorities
- Set task priority: Low, Medium, High
- Optional due date field with overdue highlighting

### 📜 Activity Log
- Tracks who performed what action (create/delete/update/assign)

---

## 🧠 Smart Assign – Logic

When Smart Assign is triggered:
1. The system fetches all users.
2. It counts how many active tasks (not "Done") each user has.
3. The user with the least number of active tasks is selected.
4. The task is assigned to that user to balance workload.

---

## ⚔️ Conflict Handling – Logic

1. Each task has an `updatedAt` timestamp.
2. When a user submits an edit, we compare their `updatedAt` with the latest one in the DB.
3. If timestamps don't match (someone else updated in the meantime), the backend sends a `409 Conflict` response.
4. A modal appears showing:
   - Your (edited) version
   - The latest (server) version
5. User can choose to:
   - Use Server Version (discard their changes)
   - Use My Changes (force update)
   - Cancel

This prevents data loss and ensures collaborative editing is safe.

---

## 📸 Screenshots (optional)
>![image](https://github.com/user-attachments/assets/22d920bc-a25b-475c-9294-6a70de08de1e)
![image](https://github.com/user-attachments/assets/3881426b-e68e-4c97-9e4a-5af0752b9a27)
![image](https://github.com/user-attachments/assets/44272e49-707d-4077-b08b-d5aa215d198c)




## 🧑‍💻 Author

Made by [Vyankatesh](https://github.com/vyankateshjadhav1) with ❤️

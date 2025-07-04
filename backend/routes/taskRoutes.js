const express = require("express");
const router = express.Router();
const controller = require("../controllers/taskController");
const auth = require("../middlewares/authMiddleware");

// Protected task routes
router.get("/", auth, controller.getAllTasks);
router.post("/", auth, controller.createTask);
router.put("/:id", auth, controller.updateTask);
router.delete("/:id", auth, controller.deleteTask);
router.post("/:id/smart-assign", auth, controller.smartAssign); // ✅ Only once

module.exports = router;

const express = require("express");
const router = express.Router();
const controller = require("../controllers/logController");
const auth = require("../middlewares/authMiddleware");

router.get("/recent", auth, controller.getRecentLogs);

module.exports = router;

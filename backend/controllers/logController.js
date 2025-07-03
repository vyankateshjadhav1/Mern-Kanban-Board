const ActionLog = require('../models/ActionLog');

exports.getRecentLogs = async (req, res) => {
  const logs = await ActionLog.find().sort({ timestamp: -1 }).limit(20).populate('user');
  res.json(logs);
};

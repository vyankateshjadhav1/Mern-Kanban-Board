const Task = require('../models/Task');
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo');
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body; // ✅ receive dueDate

  const existing = await Task.findOne({ title });
  if (existing) return res.status(400).json({ msg: 'Title already exists' });

  const task = new Task({
    title,
    description,
    priority,
    dueDate, // ✅ save dueDate too
  });

  await task.save();

  await ActionLog.create({
    action: `created task: ${title}${dueDate ? ` (due ${new Date(dueDate).toLocaleDateString()})` : ''}`,
    user: req.user.id,
  });

  res.json(task);
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);

  await ActionLog.create({ action: `deleted task: ${task.title}`, user: req.user.id });
  res.json({ msg: 'Deleted' });
};

exports.smartAssign = async (req, res) => {
  const { id } = req.params;
  const users = await User.find();

  const counts = await Promise.all(
    users.map(async user => {
      const count = await Task.countDocuments({
        assignedTo: user._id,
        status: { $ne: 'Done' }
      });
      return { user, count };
    })
  );

  const leastBusy = counts.sort((a, b) => a.count - b.count)[0].user;

  const task = await Task.findByIdAndUpdate(id, { assignedTo: leastBusy._id }, { new: true });
  await ActionLog.create({ action: `smart assigned task: ${task.title}`, user: req.user.id });

  res.json(task);
};

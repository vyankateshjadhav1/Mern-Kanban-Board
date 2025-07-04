const Task = require('../models/Task');
const User = require('../models/User');
const ActionLog = require('../models/ActionLog');

exports.getAllTasks = async (req, res) => {
  const tasks = await Task.find().populate('assignedTo');
  res.json(tasks);
};

exports.createTask = async (req, res) => {
  const { title, description, priority, dueDate } = req.body;

  //  Validation
  const forbidden = ["Todo", "In Progress", "Done"];
  if (forbidden.includes(title.trim())) {
    return res.status(400).json({ msg: "❌ Title cannot be a column name." });
  }

  const existing = await Task.findOne({ title });
  if (existing) {
    return res.status(400).json({ msg: "❌ Task title must be unique." });
  }

  const task = new Task({
    title,
    description,
    priority,
    dueDate,
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
    const { updatedAt } = req.body;

    const current = await Task.findById(req.params.id);
    if (!current) return res.status(404).json({ error: "Task not found" });

    // ⏱ Conflict detection
    if (updatedAt && new Date(updatedAt).getTime() !== new Date(current.updatedAt).getTime()) {
      return res.status(409).json({
        msg: " Task was updated by someone else.",
        current: current,  // send current server version
      });
    }

    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
};

exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);

  await ActionLog.create({
    action: `deleted task: ${task.title}`,
    user: req.user.id
  });

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

  const task = await Task.findByIdAndUpdate(
    id,
    { assignedTo: leastBusy._id },
    { new: true }
  );

  await ActionLog.create({
    action: `smart assigned task: ${task.title}`,
    user: req.user.id
  });

  res.json(task);
};

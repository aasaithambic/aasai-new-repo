const router = require('express').Router();
const Todo = require('../models/Todo');

// GET /api/todos - list all todos, newest first
router.get('/', async (req, res, next) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    next(err);
  }
});

// POST /api/todos - create a todo: { "title": "..." }
router.post('/', async (req, res, next) => {
  try {
    const title = (req.body.title || '').trim();
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const todo = await Todo.create({ title });
    res.status(201).json(todo);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/todos/:id - update title and/or completed
router.patch('/:id', async (req, res, next) => {
  try {
    const updates = {};
    if (typeof req.body.title === 'string') updates.title = req.body.title;
    if (typeof req.body.completed === 'boolean') updates.completed = req.body.completed;

    const todo = await Todo.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json(todo);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/todos/:id
router.delete('/:id', async (req, res, next) => {
  try {
    const todo = await Todo.findByIdAndDelete(req.params.id);
    if (!todo) return res.status(404).json({ message: 'Todo not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;

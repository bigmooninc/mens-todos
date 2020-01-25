const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const Todo = require('../../models/Todo');

// @route   POST api/todos
// @desc    Add a todo
// @access  Private
router.post('/', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { text } = req.body;

  try {
    const newTodo = new Todo({
      text,
      details: '',
      completed: false,
      priority: 'low'
    });

    const todo = await newTodo.save();

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET api/todos
// @desc    Get all user's todos
// @access  Private
router.get('/', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   PUT api/todos
// @desc    Update a todo
// @access  Public
router.patch('/:id', async (req, res) => {
  const { text, details, completed, priority } = req.body;

  const todoObj = {};

  if (text) todoObj.text = text;
  if (details) todoObj.details = details;
  if (completed) todoObj.completed = completed;
  if (priority) todoObj.priority = priority;

  try {
    let todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $set: todoObj
      },
      { new: true }
    );
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route       DELETE api/todos
// @desc        Delete a todo
// @access      Private

router.delete('/:id', async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ msg: 'Todo not found' });
    }

    await Todo.findByIdAndRemove(req.params.id);

    res.json({ msg: 'Todo removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;

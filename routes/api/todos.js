const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth");
const User = require("../../models/User");
const Todo = require("../../models/Todo");

// @route   POST api/todos
// @desc    Add a todo
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("text", "Text is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { text } = req.body;

    try {
      const newTodo = new Todo({
        text,
        inProcess: false,
        completed: false,
        user: req.user.id
      });

      const todo = await newTodo.save();

      res.json(todo);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET api/todos
// @desc    Get all user's todos
// @access  Private
router.get("/", async (req, res) => {
  try {
    const todos = await Todo.find().sort({ date: -1 });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   PUT api/todos
// @desc    Update a todo
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { text, completed, inProcess } = req.body;

  // Build contact object
  const todoFields = {};
  if (text) todoFields.text = text;
  if (completed) todoFields.completed = completed;
  if (inProcess) todoFields.inProcess = inProcess;

  try {
    let todo = await Todo.findById(req.params.id);

    // Make sure user owns todo
    if (!todo) {
      return res.status(400).json({ msg: "Not authorized" });
    }

    todo = await Todo.findByIdAndUpdate(
      req.params.id,
      {
        $set: todoFields
      },
      { new: true }
    );

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route       DELETE api/todos
// @desc        Delete a todo
// @access      Private

router.delete("/:id", auth, async (req, res) => {
  try {
    let todo = await Todo.findById(req.params.id);
    if (!todo) {
      res.status(404).json({ msg: "Todo not found" });
    }

    // Make sure user owns todo
    if (todo.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await Todo.findByIdAndRemove(req.params.id);

    res.json({ msg: "Todo removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;

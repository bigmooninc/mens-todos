const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TodoSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  details: {
    type: String
  },
  completed: {
    type: Boolean
  },
  prioity: {
    type: String,
    enum: ['high', 'medium', 'low']
  }
});

module.exports = Todo = mongoose.model('todo', TodoSchema);

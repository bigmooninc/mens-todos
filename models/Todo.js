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
  clipped: {
    type: Boolean
  },
  archived: {
    type: Boolean
  },
  prioity: {
    type: String,
    enum: ['high', 'medium', 'low']
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Todo = mongoose.model('todo', TodoSchema);

const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// The check on mongoose.models stops "model already registered" errors
// when the module is loaded more than once.
module.exports = mongoose.models.Todo || mongoose.model('Todo', todoSchema);

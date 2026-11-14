const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const todosRouter = require('./routes/todos');

const app = express();

app.use(cors());
app.use(express.json());

// Serverless functions can be frozen between requests, so we reuse one
// connection and only open a new one when we don't have it yet.
let connecting = null;
function connectDB() {
  if (mongoose.connection.readyState === 1) return Promise.resolve();
  if (!connecting) {
    connecting = mongoose.connect(process.env.MONGODB_URI).catch((err) => {
      connecting = null;
      throw err;
    });
  }
  return connecting;
}

app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/todos', todosRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

// Run locally with `node server.js`. On Vercel, the exported app is used instead.
if (require.main === module) {
  const port = process.env.PORT || 5000;
  connectDB().then(() => {
    app.listen(port, () => console.log(`API running on http://localhost:${port}`));
  });
}

module.exports = app;

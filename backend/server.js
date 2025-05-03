// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

const db = require('./config/db');

// Test route
app.get('/', (req, res) => {
  res.send('StudySync backend running.');
});

// Import user routes
const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const todoRoutes = require('./routes/todoRoutes');
const pomodoroRoutes = require('./routes/pomodoroRoutes');

app.use('/api/todo', todoRoutes);
app.use('/api/pomodoro', pomodoroRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const db = require('../config/db');

exports.logSession = (req, res) => {
  const { user_id, mode, start_time, end_time, duration_seconds } = req.body;

  db.query(
    'INSERT INTO pomodoro_sessions (user_id, mode, start_time, end_time, duration_seconds) VALUES (?, ?, ?, ?, ?)',
    [user_id, mode, start_time, end_time, duration_seconds],
    (err) => {
      if (err) return res.status(500).json({ error: 'Failed to log session' });
      res.json({ message: 'Pomodoro session logged' });
    }
  );
};

exports.getSessions = (req, res) => {
  db.query(
    'SELECT * FROM pomodoro_sessions WHERE user_id = ?',
    [req.query.userId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'DB fetch failed' });
      res.json(results);
    }
  );
};

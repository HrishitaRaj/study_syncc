const db = require('../config/db');

exports.logSession = (req, res) => {
  const { user_id, duration_minutes } = req.body;
  db.query(
    'INSERT INTO pomodoro_sessions (user_id, duration_minutes) VALUES (?, ?)',
    [user_id, duration_minutes],
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

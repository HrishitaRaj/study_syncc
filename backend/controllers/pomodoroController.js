const db = require('../config/db');

const formatToMySQLDatetime = (isoString) => {
  return new Date(isoString).toISOString().slice(0, 19).replace('T', ' ');
};

exports.logSession = (req, res) => {
  const { user_id, mode, start_time, end_time, duration_seconds } = req.body;

  const formattedStart = formatToMySQLDatetime(start_time);
  const formattedEnd = formatToMySQLDatetime(end_time);

  db.query(
    'INSERT INTO pomodoro_sessions (user_id, mode, start_time, end_time, duration_seconds) VALUES (?, ?, ?, ?, ?)',
    [user_id, mode, formattedStart, formattedEnd, duration_seconds],
    (err) => {
      if (err) {
        console.error('DB Insert Error:', err);
        return res.status(500).json({ error: 'Failed to log session' });
      }
      res.json({ message: 'Pomodoro session logged' });
    }
  );
};

exports.getSessions = (req, res) => {
  const { userId } = req.query;

  // Ensure userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  db.query(
    'SELECT * FROM pomodoro_sessions WHERE user_id = ? ORDER BY start_time DESC', // Fetching most recent sessions first
    [userId],
    (err, results) => {
      if (err) {
        console.error('DB Fetch Error:', err);
        return res.status(500).json({ error: 'Failed to fetch sessions' });
      }
      res.json(results);
    }
  );
};

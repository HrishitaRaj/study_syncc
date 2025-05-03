const db = require('../config/db');

exports.getTasks = (req, res) => {
    db.query('SELECT * FROM todos WHERE user_id = ? ORDER BY id DESC', [req.query.userId], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
};

exports.addTask = (req, res) => {
  const { user_id, text, priority = 'Medium', dueDate = null, notes = null } = req.body;

  db.query(
    'INSERT INTO todos (user_id, text, priority, due_date, notes) VALUES (?, ?, ?, ?, ?)',
    [user_id, text, priority, dueDate, notes],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'DB insert failed' });

      const newTaskId = result.insertId;
      db.query('SELECT * FROM todos WHERE id = ?', [newTaskId], (err, taskResults) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch new task' });

        console.log('Newly inserted task:', taskResults[0]);
        res.json(taskResults[0]);
      });
    }
  );
};  

exports.updateTask = (req, res) => {
  const { id, completed, text, priority, dueDate, notes } = req.body;

  db.query(
    'UPDATE todos SET completed = ?, text = ?, priority = ?, due_date = ?, notes = ? WHERE id = ?',
    [completed, text, priority, dueDate, notes, id],
    (err) => {
      if (err) return res.status(500).json({ error: 'DB update failed' });
      res.json({ message: 'Task updated' });
    }
  );
};

exports.deleteTask = (req, res) => {
  db.query('DELETE FROM todos WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: 'DB delete failed' });
    res.json({ message: 'Task deleted' });
  });
};

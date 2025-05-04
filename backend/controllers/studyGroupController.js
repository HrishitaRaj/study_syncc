const db = require('../config/db');

// Get all study groups
exports.getAllStudyGroups = (req, res) => {
  db.query('SELECT * FROM study_groups', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(results);
  });
};

// Create new study group
exports.createStudyGroup = (req, res) => {
  const { name, description, subject } = req.body;
  
  db.query(
    'INSERT INTO study_groups (name, description, subject) VALUES (?, ?, ?)',
    [name, description, subject],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB insert failed' });
      }
      
      const newGroupId = result.insertId;
      db.query('SELECT * FROM study_groups WHERE id = ?', [newGroupId], (err, groupResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to fetch new study group' });
        }
        
        res.status(201).json(groupResults[0]);
      });
    }
  );
};

// Get study group by ID
exports.getStudyGroupById = (req, res) => {
  db.query('SELECT * FROM study_groups WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    
    res.json(results[0]);
  });
};

// Delete study group
exports.deleteStudyGroup = (req, res) => {
  db.query('DELETE FROM study_groups WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB delete failed' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Study group not found' });
    }
    
    res.json({ message: 'Study group deleted' });
  });
};
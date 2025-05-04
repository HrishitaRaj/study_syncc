const db = require('../config/db');

// Get all resources
exports.getAllResources = (req, res) => {
  db.query('SELECT * FROM resources ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(results);
  });
};

// Get resources by user ID
exports.getUserResources = (req, res) => {
  const userId = req.query.userId;
  
  db.query('SELECT * FROM resources WHERE user_id = ? ORDER BY created_at DESC', 
    [userId], 
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB error' });
      }
      res.json(results);
    }
  );
};

// Create new resource
exports.createResource = (req, res) => {
  const { title, description, subject, resource_url, resource_type } = req.body;
  
  db.query(
    'INSERT INTO resources (title, description, subject, resource_url, resource_type) VALUES (?, ?, ?, ?, ?)',
    [title, description, subject, resource_url, resource_type],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'DB insert failed' });
      }
      
      const newResourceId = result.insertId;
      db.query('SELECT * FROM resources WHERE id = ?', [newResourceId], (err, resourceResults) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to fetch new resource' });
        }
        
        res.status(201).json(resourceResults[0]);
      });
    }
  );
};

// Get resource by ID
exports.getResourceById = (req, res) => {
  db.query('SELECT * FROM resources WHERE id = ?', [req.params.id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json(results[0]);
  });
};

// Delete resource
exports.deleteResource = (req, res) => {
  db.query('DELETE FROM resources WHERE id = ?', [req.params.id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB delete failed' });
    }
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.json({ message: 'Resource deleted' });
  });
};
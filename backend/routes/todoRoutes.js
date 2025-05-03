// todoRoutes.js
const express = require('express');
const router = express.Router();
const {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
} = require('../controllers/todocontroller');

router.get('/', getTasks);
router.post('/', addTask);
router.put('/', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;

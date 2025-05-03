// pomodoroRoutes.js
const express = require('express');
const router = express.Router();
const {
  logSession,
  getSessions,
} = require('../controllers/pomodorocontroller');

router.post('/', logSession);
router.get('/', getSessions);

module.exports = router;

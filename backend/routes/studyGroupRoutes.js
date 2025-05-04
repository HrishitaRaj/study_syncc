const express = require('express');
const router = express.Router();
const studyGroupController = require('../controllers/studyGroupController');

// GET all study groups
router.get('/', studyGroupController.getAllStudyGroups);

// GET study group by id
router.get('/:id', studyGroupController.getStudyGroupById);

// POST create new study group
router.post('/', studyGroupController.createStudyGroup);

// DELETE study group
router.delete('/:id', studyGroupController.deleteStudyGroup);

module.exports = router;
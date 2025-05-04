const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');

// GET all resources
router.get('/', resourceController.getAllResources);

// GET resource by id
router.get('/:id', resourceController.getResourceById);

// POST create new resource
router.post('/', resourceController.createResource);

// DELETE resource
router.delete('/:id', resourceController.deleteResource);

module.exports = router;
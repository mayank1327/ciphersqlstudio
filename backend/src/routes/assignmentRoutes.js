const express = require('express');
const router = express.Router();
const {
  getAllAssignments,
  getAssignmentById
} = require('../controllers/assignmentController');

// GET /api/assignments
router.get('/', getAllAssignments);

// GET /api/assignments/:id
router.get('/:id', getAssignmentById);

module.exports = router;
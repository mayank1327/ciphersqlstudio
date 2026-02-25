const express = require('express');
const router = express.Router();
const { executeQuery } = require('../controllers/queryController');

// POST /api/query/execute
router.post('/execute', executeQuery);

module.exports = router;
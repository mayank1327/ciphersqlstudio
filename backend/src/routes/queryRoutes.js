const express = require('express');
const router = express.Router();
const { executeQuery } = require('../controllers/queryController');
const validate = require('../middleware/validate');
const { executeQuerySchema } = require('../validators/queryValidator');
const { queryRateLimiter } = require('../middleware/rateLimiter');

// POST /api/query/execute
router.post('/execute', 
queryRateLimiter,
validate(executeQuerySchema),
executeQuery
);

module.exports = router;
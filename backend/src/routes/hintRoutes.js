const express = require('express');
const router = express.Router();
const { getHint } = require('../controllers/hintController');
const validate = require('../middleware/validate');
const { hintSchema } = require('../validators/queryValidator');
const { hintRateLimiter } = require('../middleware/rateLimiter');


// POST /api/hint
router.post('/', 
hintRateLimiter,
validate(hintSchema),
getHint
);

module.exports = router;

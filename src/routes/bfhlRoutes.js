const express = require('express');
const router = express.Router();
const controller = require('../controllers/bfhlController');

router.post('/bfhl', controller.handleBFHL);
router.get('/health', controller.handleHealth);

module.exports = router;
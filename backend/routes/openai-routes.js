const express = require('express');
const router = express.Router();
const openaiController = require('../controllers/openai-controllers');

router.post('/', openaiController.createPlans);

module.exports = router;

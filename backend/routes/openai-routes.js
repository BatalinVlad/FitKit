const express = require('express');
const router = express.Router();
const openAiController = require('../controllers/openai-controllers');

router.post('/', openAiController.createPlans);

module.exports = router;

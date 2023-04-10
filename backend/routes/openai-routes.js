const express = require('express');
const router = express.Router();
const openAiController = require('../controllers/openai-controllers');

router.get('/', openAiController.getApiKey);

module.exports = router;

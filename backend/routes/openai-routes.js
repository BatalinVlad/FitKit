const express = require('express');
const router = express.Router();
const openAiController = require('../controllers/openai-controller');

router.post('/', openAiController.createPlans);

module.exports = router;

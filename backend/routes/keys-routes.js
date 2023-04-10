const express = require('express');
const router = express.Router();
const apiKeysController = require('../controllers/keys-controllers');

router.get('/', apiKeysController.getApiKey);

module.exports = router;

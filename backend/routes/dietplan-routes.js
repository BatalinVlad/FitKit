const express = require('express');
const router = express.Router();

const { check } = require('express-validator');

const dietsController = require('../controllers/diets-controller');

router.post('/create/:uid',
    [
        check('description')
            .not()
            .isEmpty(),
    ],
    dietsController.createDietPlan);

module.exports = router;

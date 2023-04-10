const express = require('express');
const { check } = require('express-validator');

const mainChatController = require('../controllers/mainchat-controllers');

const router = express.Router();

router.get('/', mainChatController.getMessages);

router.post(
    '/sendMsg',
    [
        check('msgId')
            .not()
            .isEmpty(),
        check('chat')
            .not()
            .isEmpty(),
        check('authorId')
            .not()
            .isEmpty(),
        check('authorName')
            .not()
            .isEmpty(),
        check('messageBody')
            .not()
            .isEmpty(),
        check('date')
            .not()
            .isEmpty()
    ],
    mainChatController.newMessage
);

module.exports = router;

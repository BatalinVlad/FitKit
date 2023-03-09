const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Message = require('../models/Message');

const getMessages = async (req, res, next) => {
    let messages;
    try {
        messages = await Message.find();
    } catch (err) {
        const error = new HttpError('fetching messages to main chat failed, please try again later', 500)
        return next(error);
    }
    res.json({ loadedMessages: messages.map(message => message.toObject({ getters: true })) });
}

const newMessage = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422))
    }
    const { msgId, chat, authorId, authorName, messageBody, date } = req.body;

    const createdNewMessage = new Message({
        msgId,
        chat,
        authorId,
        authorName,
        messageBody,
        date,
    });

    try {
        await createdNewMessage.save();
    } catch (err) {
        const error = new HttpError('failed to send the message', 500);
        return next(error);
    }

    res.status(201).json({
        msgId: createdNewMessage.msgId,
        chat: createdNewMessage.chat,
        authorId: createdNewMessage.authorId,
        authorName: createdNewMessage.authorName,
        messageBody: createdNewMessage.messageBody,
        date: createdNewMessage.date
    });
};

exports.newMessage = newMessage;
exports.getMessages = getMessages;

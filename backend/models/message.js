const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    msgId: { type: String, required: true, unique: true },
    chat: { type: String, required: true },
    authorId: { type: String, required: true },
    authorName: { type: String, required: true },
    messageBody: { type: String, require: true },
    date: { type: String, require: true },
});

messageSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Message', messageSchema);
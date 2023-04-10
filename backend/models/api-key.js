const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const apiKeysSchema = new Schema({
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
});

apiKeysSchema.plugin(uniqueValidator);

module.exports = mongoose.model('ApiKey', apiKeysSchema);
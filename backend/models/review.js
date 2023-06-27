const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
    description: { type: String, required: true },
    userImage: { type: String, required: true },
    creator: { type: mongoose.Types.ObjectId, ref: 'User' },
    isGuest: { type: Boolean, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
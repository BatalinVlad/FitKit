const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    name: { type: String, required: true },
    stars: { type: Number, required: true },
    description: { type: String, required: true },
    userImage: { type: String, required: true },
    likes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
    dislikes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'User' }],
    creator: { type: mongoose.Types.ObjectId, ref: 'User' },
    isGuest: { type: Boolean, required: true }
});

module.exports = mongoose.model('Review', reviewSchema);
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    creatorId: { type: mongoose.Types.ObjectId, ref: 'User' },
    image: {
        image_id: { type: String, required: true },
        secure_url: { type: String, required: true }
    },
    title: { type: String, required: true },
    description_short: { type: String, required: true },
    description: { type: String, required: true },
    favorites: [{ type: mongoose.Types.ObjectId, ref: 'User', required: true }],
    rating: { type: Number, required: true },
    price: { type: Number, required: true },
});

module.exports = mongoose.model('Product', productSchema);
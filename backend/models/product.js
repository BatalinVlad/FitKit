const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    creator: { type: mongoose.Types.ObjectId, ref: 'User' },
    productId: { type: String, required: true },
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
    date: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
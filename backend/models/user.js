const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    role: { type: String, required: true },
    image: {
        image_id: { type: String, required: true },
        secure_url: { type: String, required: true }
    },
    reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
    products: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Product' }],
    dietPlans: [{ type: String, required: true }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
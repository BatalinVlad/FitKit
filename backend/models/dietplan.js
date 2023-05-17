const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dietPlanSchema = new Schema({
    creatorId: { type: mongoose.Types.ObjectId, ref: 'User' },
    creatorName: { type: String, required: true },
    description: { type: String, required: true },
});

module.exports = mongoose.model('DietPlan', dietPlanSchema);
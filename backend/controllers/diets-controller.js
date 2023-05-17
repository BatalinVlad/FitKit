const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const DietPlan = require('../models/dietplan');
const User = require('../models/user');

const createDietPlan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed, please check your data.', 422));
    }

    const userId = req.params.uid; //get user by Id
    const { description } = req.body;
    let user;
    try {
        user = await User.findById(userId, '-password');

    } catch (err) { // error while sending req
        const error = new HttpError('Fetching user failed, try again later.', 500);
        return next(error);
    }

    if (!user) { // didnt find the user
        return next(
            new HttpError('Could not find user for the provided user id.', 404)
        );
    }

    const createdDietPlan = new DietPlan({
        creatorId: userId,
        creatorName: user.name,
        description
    });

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdDietPlan.save({ session: sess });
        user.dietPlans.push(description);
        await user.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        const error = new HttpError('Something went wrong, could not save', 500);
        return next(error);
    }

    res.status(201).json({ dietPlan: createdDietPlan.toObject({ getters: true }) });
}

exports.createDietPlan = createDietPlan;
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]; // Ahtorization : 'Bearer TOKEN'
        if (token === 'guestMode') {
            req.userData = { userId: ObjectId() }
            return next();
            // throw new Error('Authentication failed!')
        } else {
            const decodedToken = jwt.verify(token, 'supersecret_dont_share');
            req.userData = { userId: decodedToken.userId };
            next();
        }
    } catch (err) {
        const error = new HttpError('Authentication failed!', 403)
        return next(error);
    }
};
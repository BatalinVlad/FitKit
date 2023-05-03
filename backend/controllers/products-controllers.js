// const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
// const cloudinary = require('../utils/cloudinary');
const HttpError = require('../models/http-error');
const Product = require('../models/product');
// const User = require('../models/user');
// const getDataUri = require('../utils/datauri');


const getProducts = async (req, res, next) => {
    let products;
    try {
        products = await Product.find();
    } catch (err) {
        const error = new HttpError('fetching products failed, please try again later', 500)
        return next(error);
    }
    res.json({ loadedproducts: products.map(product => product.toObject({ getters: true })) })
};

const getProductById = async (req, res, next) => {
    const reviewId = req.params.rid; // { rid: 'r1' }
    let review;

    try {
        review = await Review.findById(reviewId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a review', 500);
        return next(error)
    }

    if (!review) {
        const error = new HttpError('Could not find a review for the provided id.', 404);
        return next(error)
    }

    res.json({ review: review.toObject({ getters: true }) }); // => { review } => { review: review }
};

exports.getProducts = getProducts;
exports.getProductById = getProductById;

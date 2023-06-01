const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const HttpError = require('../models/http-error');

const Product = require('../models/product');
const User = require('../models/user');

const cloudinary = require('../utils/cloudinary');
const getDataUri = require('../utils/datauri');


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
    const productId = req.params.rid; // { rid: 'r1' }
    let product;

    try {
        product = await Product.findById(productId);
    } catch (err) {
        const error = new HttpError('Something went wrong, could not find a product', 500);
        return next(error)
    }

    if (!product) {
        const error = new HttpError('Could not find a product for the provided id.', 404);
        return next(error)
    }

    res.json({ product: product.toObject({ getters: true }) }); // => { product } => { product: product }
};

const createProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(
            new HttpError('Invalid inputs passed, please check your data.', 422)
        );
    }
    const { creator, productId, title, description, description_short, price } = req.body;

    const file = req.file;
    const fileUri = getDataUri(file);

    let imagePath;

    try {
        imagePath = await cloudinary.v2.uploader.upload(fileUri.content);
    } catch (err) {
        const error = new HttpError('Upload Image failed, please try again', 500);
        return next(error);
    }

    const createdProduct = new Product({
        creator,
        productId,
        title,
        description,
        description_short,
        favorites: [],
        image: {
            image_id: imagePath.public_id,
            secure_url: imagePath.secure_url
        },
        rating: 0,
        price,
    });


    let user;
    try {
        user = await User.findById(creator);
    } catch (err) {
        const error = new HttpError('Creating product failed, please try again', 500);
        return next(error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdProduct.save({ session: sess });

        user.products.push(createdProduct);
        await user.save({ session: sess });
        await sess.commitTransaction();
    }
    catch (err) {
        const error = new HttpError('Creating Product failed, Please try again.', 500);
        return next(error);
    }

    res.status(200).json({ product: createdProduct.toObject({ getters: true }) });
};

const deleteProduct = async (req, res, next) => {
    const productId = req.params.pid;

    let product;
    try {
        product = await Product.findById(productId).populate('creator');
    } catch (err) {
        const error = new HttpError('Something went wrong, Could not delete the product', 500);
        return next(error);
    }

    if (!product) {
        const error = new HttpError('Could not find product for this id', 403);
        return next(error);
    }

    // if (product.creator.id !== req.body.creator) {
    //     const error = new HttpError(
    //         'you are not allowed to delete this product.', 401
    //     )
    //     return next(error);
    // }

    try {
        const result = await cloudinary.uploader.destroy(product.image.image_id);
        console.log('Image deleted:', result);
    } catch (error) {
        console.error('Error deleting image:', error);
    }

    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await product.remove({ session: sess });
        await product.creator.products.pull(product);

        await product.creator.save({ session: sess });
        await sess.commitTransaction();

    } catch (err) {
        const error = new HttpError('Something went wrong, Could not delete the product', 500);
        return next(error);
    }
    res.status(200).json({ messege: 'Deleted product' });
};

exports.deleteProduct = deleteProduct;
exports.getProducts = getProducts;
exports.getProductById = getProductById;
exports.createProduct = createProduct;

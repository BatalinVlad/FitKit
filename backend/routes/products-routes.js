const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const productsControllers = require('../controllers/products-controllers');
const uploadSingleImage = require('../middleware/file-upload')

const router = express.Router();

router.get('/', productsControllers.getProducts);

router.get('/:pid', productsControllers.getProductById);

router.use(checkAuth);

router.put(
    '/:pid',
    uploadSingleImage,
    [
        check('title').not().isEmpty(),
        check('description_short').not().isEmpty(),
        check('description').not().isEmpty(),
        check('price').not().isEmpty(),
    ],
    productsControllers.updateProduct
);

router.post(
    '/',
    uploadSingleImage,
    [
        check('title').not().isEmpty(),
        check('description_short').not().isEmpty(),
        check('description').not().isEmpty(),
        check('price').not().isEmpty(),
    ],
    productsControllers.createProduct
);


router.delete('/:pid', productsControllers.deleteProduct);


module.exports = router;

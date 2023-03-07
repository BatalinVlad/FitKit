const multer = require('multer');
const uuid = require('uuid/v1');

const MINE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}


const storage = multer.memoryStorage()

const uploadSingleImage = multer({
    limits: 500000,
    storage: storage,
    fileFilter: (req, file, cb) => {
        const isValid = !!MINE_TYPE_MAP[file.mimetype];
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
}).single('image');

module.exports = uploadSingleImage;
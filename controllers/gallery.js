const shortid = require('shortid');
const {validate} = require('jsonschema');
const multer = require('multer');
const db = require('../db/db');
const fs = require('fs');

const storage = multer.diskStorage({
    destination (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename (req, file, cb) {
        const encodingFile = file.originalname.slice(file.originalname.indexOf('.'));
        if (encodingFile === '.jpg' || encodingFile === '.png') {
            cb(null, `${file.fieldname}-${Date.now()}${encodingFile}`);
        } else {
            return true;
        }
    },
});
const upload = multer({storage});

const getGallery = (req, res, next) => {
    let gallery = [];
    try {
        gallery = db.get('gallery');
    } catch (error) {
        throw new Error(error);
    }
    res.json({status: 'OK', data: gallery});
};

const getPhoto = (req, res, next) => {
    const {id} = req.params;

    const photo = db
        .get('gallery')
        .find({id})
        .value();

    if (!photo) {
        throw new Error('PHOTO_NOT_FOUND');
    }

    res.json({status: 'OK', data: photo});
};


const createPhoto = (req, res, next) => {
    const pathPhoto = `/${req.file.destination}${req.file.filename}`;
    const photo = {
        id: shortid.generate(),
        path: pathPhoto
    };
    try {
        db.get('gallery')
            .unshift(photo)
            .write();
    } catch (error) {
        throw new Error(error);
    }

    res.json({
        status: 'OK',
        data: photo
    });
};

const createScreenShot = (req, res, next) => {
    const {base64} = req.body;
    const data = base64.replace(/^data:image\/\w+;base64,/, '');
    const fileName = `${shortid.generate()}.png`;
    const filePath = 'uploads/';
    fs.writeFile(filePath + fileName, data, {encoding: 'base64'}, () => {
        const screenShot = {
            id: shortid.generate(),
            path: `/${filePath + fileName}`
        };
        try {
            db.get('gallery')
                .unshift(screenShot)
                .write();
        } catch (error) {
            throw new Error(error);
        }
    });
};

const deletePhoto = (req, res, next) => {
    db.get('gallery')
        .remove({id: req.params.id})
        .write();

    res.json({status: 'OK'});
};

module.exports = {
    upload,
    getGallery,
    getPhoto,
    createPhoto,
    deletePhoto,
    createScreenShot
};

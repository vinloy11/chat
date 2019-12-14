const express = require('express');

const router = express.Router();
const galleryController = require('../controllers/gallery');
// GET /gallery
router.get('/', galleryController.getGallery);

// GET /gallery/:id
router.get('/:id', galleryController.getPhoto);

// POST /gallery
router.post('/', galleryController.upload.single('avatar'), galleryController.createPhoto);

// POST /gallery/screenshot
router.post('/screenshot', galleryController.createScreenShot);

// DELETE /gallery/:id
router.delete('/:id', galleryController.deletePhoto);

module.exports = router;

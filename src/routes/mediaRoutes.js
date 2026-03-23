const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middlewares/upload');
const auth = require('../middlewares/auth');
// Protected routes
router.use(auth);

// upload media
router.post('/upload',upload.array('media', 10), mediaController.uploadMedia);

// make media favourite
router.patch('/make-favourite/:id', mediaController.makeFavourite);

router.get('/get-favourite-media/:userId', mediaController.getFavMediaByUserId);

// router.post('/upload', upload.single('media'), mediaController.uploadMedia);

// get all media by user id
router.get('/get-all-media/:userId', mediaController.getMediaByUserId);

//get media by id
router.get('/get-media/:id', mediaController.getMediaById);

//get soft deleted media by user id
router.get('/get-trashed-media/:userId', mediaController.getSoftDeletedMediaByUserId);

// update media
router.put('/update-media/:id', mediaController.updateMedia);

// // delete media
router.delete('/delete-media/:id', mediaController.deleteMedia);

module.exports = router;



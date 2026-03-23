const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

// Register a new user
router.post('/register', userController.register);
// Login user
router.post('/login', userController.login);

router.post('/renew-refresh-token',userController.renewRefreshToken);
// Protected routes
router.use(auth);
// Logout user
router.post('/logout', userController.logout);

// Delete user
router.delete('/:id', userController.deleteUser);

// Get user profile
router.get('/profile/:id', userController.getUserProfile);

//update user profile
router.put('/profile/:id', userController.updateUserProfile);

router.get('/get-all-users', userController.getAllUsers);

module.exports = router;
const express = require ('express');
const authController = require ('../controllers/authController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const router = express.Router ();

// Route for user login
router.post ('/login', authController.login);
router.post ('/register', verifyToken, isAdmin, authController.register);
router.post ('/change-password', verifyToken, authController.changePassword);

module.exports = router;

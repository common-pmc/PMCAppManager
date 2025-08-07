const express = require ('express');
const authController = require ('../controllers/authController');
const {verifyToken} = require ('../middlewares/authToken');
const isAdmin = require ('../middlewares/isAdmin');
const router = express.Router ();

// Route for user login
router.post ('/login', authController.login);
router.post ('/register', verifyToken, isAdmin, authController.register);

module.exports = router;

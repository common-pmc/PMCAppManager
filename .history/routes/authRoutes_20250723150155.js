const express = require ('express');
const authController = require ('../controllers/authController');
const authToken = require ('../middlewares/authToken');
const router = express.Router ();

// Route for user login
router.post ('/login', authController.login);
router.post ('/register', authToken, authController.register);

module.exports = router;

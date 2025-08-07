const express = require ('express');
const {getAllUsers, createUser} = require ('../controllers/userController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

router.get ('/', verifyToken, isAdmin, getAllUsers);
router.post ('/register', verifyToken, isAdmin, createUser);

module.exports = router;

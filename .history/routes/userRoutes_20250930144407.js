const express = require ('express');
const {
  getAllUsers,
  createUser,
  getUserDashboard,
} = require ('../controllers/userController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

router.get ('/', verifyToken, isAdmin, getAllUsers);
router.post ('/register', verifyToken, isAdmin, createUser);
router.get ('/dashboard', verifyToken, getUserDashboard);

module.exports = router;

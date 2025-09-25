const express = require ('express');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const {
  getUserDetails,
  deleteUser,
} = require ('../controllers/adminUserController');

const router = express.Router ();

router.get ('/users/:id', verifyToken, isAdmin, getUserDetails);

router.delete ('/users/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;

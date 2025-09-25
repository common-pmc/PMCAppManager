const express = require ('express');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const {
  getUserDetails,
  deleteUser,
} = require ('../controllers/adminUserController');

const router = express.Router ();

router.get ('/:id', verifyToken, isAdmin, getUserDetails);

router.delete ('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;

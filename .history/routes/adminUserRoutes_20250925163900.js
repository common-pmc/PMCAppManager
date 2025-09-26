const express = require ('express');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const {
  getUserDetails,
  toggleUserActive,
  deleteUser,
} = require ('../controllers/adminUserController');

const router = express.Router ();

router.get ('/:id', verifyToken, isAdmin, getUserDetails);

router.patch ('/:id/toggle-active', verifyToken, isAdmin, toggleUserActive);

router.delete ('/:id', verifyToken, isAdmin, deleteUser);

module.exports = router;

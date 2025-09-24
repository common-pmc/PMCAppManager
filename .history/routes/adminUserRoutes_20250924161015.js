const express = require ('express');
const {verifyToken, isAdmin} = require ('../middleware/authMiddleware');
const {getUserDetails} = require ('../controllers/adminUserController');

const router = express.Router ();

router.get ('/admin/users/:id', verifyToken, isAdmin, getUserDetails);

module.exports = router;

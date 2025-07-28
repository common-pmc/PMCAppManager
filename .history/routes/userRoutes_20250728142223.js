const express = require ('express');
const {getAllUsers} = require ('../controllers/userController');
const verifyToken = require ('../middlewares/authToken');
const isAdmin = require ('../middlewares/isAdmin');

const router = express.Router ();

router.get ();

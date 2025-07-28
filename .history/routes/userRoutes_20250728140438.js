const express = require ('express');
const {getAllUsers} = require ('../controllers/userController');
const verifyToken = require ('../middlewares/authToken');

const router = express.Router ();

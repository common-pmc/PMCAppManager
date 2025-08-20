const express = require ('express');
const companyController = require ('../controllers/companyController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

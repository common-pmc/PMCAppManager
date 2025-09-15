const express = require ('express');
const adminFileController = require ('../controllers/adminFileController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

module.exports = router;

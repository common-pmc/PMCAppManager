const express = require ('express');
const {uploadFile, getFiles} = require ('../controllers/adminFileController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const upload = require ('../middlewares/upload');

const router = express.Router ();

module.exports = router;

const express = require ('express');
const {getFileDownloadDetails} = require ('../controllers/logController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

module.exports = router;

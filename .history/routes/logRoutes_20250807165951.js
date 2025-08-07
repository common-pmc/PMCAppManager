const express = require ('express');
const {getFullDownloadLogs} = require ('../controllers/logController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

module.exports = router;

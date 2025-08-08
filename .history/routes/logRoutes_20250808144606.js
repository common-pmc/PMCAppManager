const express = require ('express');
const {getFileDownloadDetails} = require ('../controllers/logController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

router.get ('/:fileId/downloads', verifyToken, isAdmin, getFileDownloadDetails);

module.exports = router;

const express = require ('express');
const {
  downloadFile,
  downloadZip,
  getFilesByCompany,
} = require ('../controllers/userFileController');
const {verifyToken} = require ('../middlewares/authToken');

const router = express.Router ();

router.get ('/:id/download', verifyToken, downloadFile);
router.post ('/download-zip', verifyToken, downloadZip);
router.get ('/', verifyToken, getFilesByCompany);

module.exports = router;

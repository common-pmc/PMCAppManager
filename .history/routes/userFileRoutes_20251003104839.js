const express = require ('express');
const {
  downloadFile,
  getFilesByCompany,
} = require ('../controllers/userFileController');
const {verifyToken} = require ('../middlewares/authToken');

const router = express.Router ();

router.get ('/:id/download', verifyToken, downloadFile);
router.get ('/dashboard', verifyToken, getFilesByCompany);

module.exports = router;

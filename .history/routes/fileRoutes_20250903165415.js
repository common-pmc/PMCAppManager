const express = require ('express');
const upload = require ('../middlewares/upload');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const {
  uploadFile,
  downloadFile,
  getFiles,
} = require ('../controllers/fileController');

const router = express.Router ();

router.post (
  '/upload',
  verifyToken,
  isAdmin,
  upload.single ('file'),
  uploadFile
);
router.get ('/download/:token', downloadFile);
router.get ('/', verifyToken, getFiles);

module.exports = router;

const express = require ('express');
const {
  uploadFile,
  getAllFiles,
  downloadFile,
} = require ('../controllers/adminFileController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const upload = require ('../middlewares/upload');

const router = express.Router ();

router.post (
  '/files/upload',
  verifyToken,
  isAdmin,
  upload.single ('file'),
  uploadFile
);
router.get ('/files', verifyToken, isAdmin, getAllFiles);
router.get ('/files/:id/download', verifyToken, isAdmin, downloadFile);

module.exports = router;

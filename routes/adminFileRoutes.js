const express = require ('express');
const {
  uploadFile,
  getAllFiles,
  downloadFile,
  getProductNames
} = require ('../controllers/adminFileController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const upload = require ('../middlewares/upload');

const router = express.Router ();

router.post (
  '/files/upload',
  verifyToken,
  isAdmin,
  upload.array ('files', 10), // Поддържа качване на до 10 файла едновременно
  uploadFile
);
router.get ('/files', verifyToken, isAdmin, getAllFiles);
router.get ('/files/:id/download', verifyToken, isAdmin, downloadFile);
router.get ('/files/products', verifyToken, isAdmin, getProductNames);

module.exports = router;

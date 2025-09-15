const express = require ('express');
const {
  uploadFile,
  getAllFiles,
} = require ('../controllers/adminFileController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const upload = require ('../middlewares/upload');

const router = express.Router ();

router.post (
  '/upload',
  verifyToken,
  isAdmin,
  upload.single ('file'),
  uploadFile
);
router.get ('/', verifyToken, isAdmin, getAllFiles);

module.exports = router;

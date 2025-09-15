const express = require ('express');
const {uploadFile, getFiles} = require ('../controllers/adminFileController');
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
router.get ('/', verifyToken, isAdmin, getFiles);

module.exports = router;

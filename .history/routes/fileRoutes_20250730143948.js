const express = require ('express');
const upload = require ('../middlewares/upload');
const {verifyToken, isAdmin} = require ('../middlewares/auth');
const {uploadFile} = require ('../controllers/fileController');

const router = express.Router ();

router.post (
  '/upload',
  verifyToken,
  isAdmin,
  upload.single ('file'),
  uploadFile
);

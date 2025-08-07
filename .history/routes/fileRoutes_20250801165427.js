import {
  down,
} from '../.history/database/seeders/20250722125830-demo-files_20250722160548';
const express = require ('express');
const upload = require ('../middlewares/upload');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');
const {
  uploadFile,
  generateDownloadLink,
  downloadFile,
} = require ('../controllers/fileController');

const router = express.Router ();

router.post (
  '/upload',
  verifyToken,
  isAdmin,
  upload.single ('file'),
  uploadFile
);

router.get ('/generate-link/:fileId', verifyToken, generateDownloadLink);
router.get ('/download/:token', downloadFile);

module.exports = router;

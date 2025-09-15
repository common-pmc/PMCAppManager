const express = require ('express');
const adminFileController = require ('../controllers/adminFileController');
const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

router.post ('/upload', verifyToken, isAdmin, adminFileController.uploadFile);
router.get ('/:id/download', adminFileController.downloadFile);
router.get ('/', verifyToken, isAdmin, adminFileController.getFiles);

module.exports = router;

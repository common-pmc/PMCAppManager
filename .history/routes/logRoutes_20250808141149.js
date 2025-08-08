const express = require ('express');

const {verifyToken, isAdmin} = require ('../middlewares/authToken');

const router = express.Router ();

module.exports = router;

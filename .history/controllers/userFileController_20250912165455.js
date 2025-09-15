const {
  File,
  User,
  Company,
  Department,
  DownloadHistory,
  DownloadLog,
} = require ('../database/models');
const jwt = require ('jsonwebtoken');
const path = require ('path');
const fs = require ('fs');

const SECRET = process.env.JWT_SECRET || 'my_secret_key';

exports.downloadFile = async (req, res) => {
  try {
    // Get the token from the request headers
    const token =
      req.headers.authorization && req.headers.authorization.split (' ')[1];
  } catch (error) {
    //
  }
};

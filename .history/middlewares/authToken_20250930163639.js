const jwt = require ('jsonwebtoken');
const {User} = require ('../database/models');

async function verifyToken (req, res, next) {
  try {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split (' ')[1];
    if (!token) {
      return res.status (401).json ({message: 'Access token is required'});
    }

    const decoded = jwt.verify (token, process.env.JWT_SECRET);
  } catch (error) {
    //
  }
}

function isAdmin (req, res, next) {
  if (!req.user || !req.user.isAdmin) {
    return res.status (403).json ({message: 'Admin access required'});
  }
  next ();
}

module.exports = {
  verifyToken,
  isAdmin,
};

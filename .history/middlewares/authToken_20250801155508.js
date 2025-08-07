const jwt = require ('jsonwebtoken');

function verifyToken (req, res, next) {
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split (' ')[1];
  if (!token) {
    return res.status (401).json ({message: 'Access token is required'});
  }

  jwt.verify (token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status (403).json ({message: 'Invalid access token'});
    }
    req.user = user;
    next ();
  });
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

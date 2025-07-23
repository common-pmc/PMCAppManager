const jwt = require ('jsonwebtoken');

const authToken = (req, res, next) => {
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
};

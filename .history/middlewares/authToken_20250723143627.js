const jwt = require ('jsonwebtoken');

const authToken = (req, res, next) => {
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split (' ')[1];
  if (!token) {
    return res.status (401).json ({message: 'Access token is required'});
  }
};

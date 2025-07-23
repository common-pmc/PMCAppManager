const jwt = require ('jsonwebtoken');

const authToken = (req, res, next) => {
  const authHeaders = req.headers['authorization'];
  const token = authHeaders && authHeaders.split (' ')[1];
};

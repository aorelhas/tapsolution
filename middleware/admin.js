const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(400).json({ msg: 'No token, invalid authorization' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    console.log(req.user.role);
    if (req.user.role === 0) {
      return res.sstatus(403).json({ msg: 'Admin Resource' });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

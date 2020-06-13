const User = require('../models/User');

module.exports = function (req, res, next) {
  let user = User.findById(req.params.id);

  if (!user) {
    return res.status(400).json({ msg: 'No user found' });
  }
  console.log(user.role);
  if (user.role === 0) {
    return res.status(403).json({ msg: 'You must be admin!' });
  }
  next();
};

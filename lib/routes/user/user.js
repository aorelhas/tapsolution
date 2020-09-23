const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please enter an email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      //TODO Implement GRAVATAR

      user = new User({
        name,
        email,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await brcrypt.hash(password, salt);

      // Return JWT
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sing(
        payload,
        config.get(jwtSecret),
        // 15 minutes expiration
        { expiresIn: 900 },

        // Prevente XSS atacks
        { httpOnly: true },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(error.message);
      res.status(500).send('Server Error!');
    }
  }
);
module.exports = router;

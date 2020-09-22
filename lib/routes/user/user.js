const express = require('express');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const User = require('../../models/User');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
  '/',
  [check('name'), check('email'), check('password')],
  async (req, res) => {
    const errors = validationResult(req);
  }
);
module.exports = router;

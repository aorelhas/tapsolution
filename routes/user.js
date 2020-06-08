const express = require('express');
const router = express.Router();

const User = require('../models/User');

// @route   POST api/users
// @desc    Test
// @access  Public
router.get('/', (req, res) => res.send('USERS'));

module.exports = router;

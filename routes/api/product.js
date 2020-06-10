const express = require('express');
const router = express.Router();
// const auth = require('../../middleware/auth');
// const admin = require('../../middleware/admin');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Product = require('../../models/Product');

// @route   POST api/product/create
// @desc    Create Product
// @access  Private
router.get('/create', (req, res) => {
  res.send('test');
});

module.exports = router;

const express = require('express');
const router = express.Router();
// const auth = require('../../middleware/auth');
// const admin = require('../../middleware/admin');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Product = require('../../models/Product');

// @route   POST api/product/create
// @desc    Create Product
// @access  Private
router.post('/create/:user_id', async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ msg: err.array() });
    }

    let product = new Product(fields);

    if (files.photo) {
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) throw err;

      res.json(result);
    });
  });
});

module.exports = router;

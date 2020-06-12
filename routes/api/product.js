const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
// const admin = require('../../middleware/admin');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Product = require('../../models/Product');

// @route   POST api/product/create
// @desc    Create Product
// @access  Private
router.post('/create/:user_id', auth, async (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({ msg: 'Image not valid' });
    }

    const { name, description, price, category, quantity, shipping } = fields;

    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !quantity ||
      !shipping
    ) {
      return res.status(400).json({ msg: 'Please fill all the fields' });
    }

    let product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({ msg: 'Image should be less than 1MB' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) throw err;

      res.json(result);
    });
  });
});

// @route   POST api/product/:product_id
// @desc    Create Product
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).select('-photo');

    if (!product) {
      return res.status(400).json({ msg: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }

    res.status(500).send('Server Error!');
  }
});
module.exports = router;

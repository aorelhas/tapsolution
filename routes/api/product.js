const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const formidable = require('formidable');
const _ = require('lodash');
const fs = require('fs');

const Product = require('../../models/Product');
const User = require('../../models/User');

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

// @route   GET api/product/:id
// @desc    Get Product By Id
// @access  Public
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

// @route   DELETE api/product/:id/:user_id
// @desc    Delete Product By Id
// @access  Private
router.delete('/:id/:user_id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(400).json({ msg: 'Product not found' });
    }

    const user = await User.findById(req.user.id);

    if (user.role === 0) {
      return res.status(400).json({
        msg: 'You are not allowed to delete the product. You must be admin.',
      });
    }

    await product.remove();
    res.json({ msg: 'Product removed!' });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    return res.status(500).send('Server Error!');
  }
});

// @route   PUT api/product/update
// @desc    Update Product
// @access  Private
// router.put('/update/:id/:user_id', auth, async (req, res) => {
//   let form = new formidable.IncomingForm();
//   form.keepExtensions = true;
//   form.parse(req, (err, fields, files) => {
//     if (err) {
//       return res.status(400).json({ msg: 'Image not valid' });
//     }

//     const { name, description, price, category, quantity, shipping } = fields;

//     if (
//       !name ||
//       !description ||
//       !price ||
//       !category ||
//       !quantity ||
//       !shipping
//     ) {
//       return res.status(400).json({ msg: 'Please fill all the fields' });
//     }

//     try {
//       let products = Product.findOne({ id: req.params.id });

//       if (products) {
//         let product = Product.findOneAndUpdate(
//           { id: req.params.id },
//           { $set: fields },
//           { new: true }
//         );
//         return res.json(product || {});
//       }
//     } catch (err) {
//       console.error(err.message);
//       return res.status(500).send('Server Error!');
//     }

//     // let product = Product.findOne({ id: req.params.id });

//     // if (files.photo) {
//     //   if (files.photo.size > 1000000) {
//     //     return res.status(400).json({ msg: 'Image should be less than 1MB' });
//     //   }
//     //   product.photo.data = fs.readFileSync(files.photo.path);
//     //   product.photo.contentType = files.photo.type;
//     // }

//     // product.save((err, result) => {
//     //   if (err) throw err;

//     //   res.json(result);
//     // });
//   });
// });

/*api/product?sortBy=createdAt&order=desc&limit=4 */

// @route    GET api/product
// @desc     Get all Products
// @access   Public
router.get('/', async (req, res) => {
  try {
    let order = req.query.order ? req.query.order : 'asc';
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    await Product.find()
      .select('-photo')
      .populate('category')
      .sort([[sortBy, order]])
      .limit(limit)
      .exec((err, products) => {
        if (err) {
          return res.status(400).json({ msg: 'Product not found' });
        }
        res.json(products);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
  }
});

// @route    GET api/product/related/:id
// @desc     Get related products by category
// @access   Public
router.get('/related/:id', async (req, res) => {
  try {
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    await Product.find({
      _id: { $ne: req.product },
      category: req.params.id,
    })
      .select('-photo')
      .limit(limit)
      .populate('category', '_id name')
      .exec((err, product) => {
        if (err) {
          return res.status(400).json({ msg: 'No related products found' });
        }
        res.json(product);
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    GET api/product/categories
// @desc     Get distinct categories
// @access   Public
router.get('/categories', async (req, res) => {
  let product = await Product.distinct({ _id }, 'category');
  if (!product) {
    return res.status(400).json({ msg: 'Category not found' });
  }
  res.json(product);
});

// @route    GET api/product/by/search
// @desc     Get products by serach
// @access   Public
router.post('/by/search', async (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  await Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
});

// @route    GET api/product/photo/:id
// @desc     Get products image
// @access   Public
router.get('/photo/:id', async (req, res, next) => {
  const photoProd = await Product.findById(req.params.id);
  console.log(photoProd);
  if (photoProd) {
    res.set('Content-Type', photoProd.photo.contentType);
    return res.send(photoProd.photo);
  }
  next();
});
module.exports = router;

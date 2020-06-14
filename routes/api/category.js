const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

const { check, validationResult } = require('express-validator');

const Category = require('../../models/Category');
const User = require('../../models/User');

// @route   POST api/category/create
// @desc    Create Category
// @access  Private
router.post(
  '/create',
  [check('name', 'Please insert category name').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;

    try {
      let category = await Category.findOne({ name });

      if (category) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Category already exists' }] });
      }

      category = new Category({
        name,
      });

      await category.save();
      res.json(category);
    } catch (err) {
      console.error(err.message);

      res.status(500).send('Server Error!');
    }
  }
);

// @route   GET api/category/:id
// @desc    Get Category By Id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(400).json({ msg: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error!');
  }
});

// @route   DELETE api/category/:id/:user_id
// @desc    Delete Category By id
// @access  Private
router.delete('/:id/:user_id', auth, async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(400).json({ msg: 'Category not found' });
    }

    const user = await User.findById(req.user.id);

    if (user.role === 0) {
      return res.status(400).json({
        msg: 'You are not allowed to delete the product. You must be admin.',
      });
    }

    await category.remove();
    res.json({ msg: 'Category Removed' });
  } catch (err) {
    console.error(err.message);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Product not found' });
    }
    return res.status(500).send('Server Error!');
  }
});

// @route   PUT api/category/update/:id/:user_id
// @desc    Update Product
// @access  Private
router.put(
  '/update/:id/:user_id',
  [check('name', 'Please insert category name').not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name } = req.body;
    const fields = { name };

    try {
      let category = await Category.findById(req.params.id);

      if (category) {
        category = await Category.findOneAndUpdate(
          { _id: req.params.id },
          { $set: fields },
          { new: true }
        );

        return res.json(category);
      }
    } catch (err) {
      console.error(err.message);

      res.status(500).send('Server Error!');
    }
  }
);

// @route    GET api/category
// @desc     Get all Categories
// @access   Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error!');
  }
});

module.exports = router;

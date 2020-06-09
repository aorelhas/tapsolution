const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');
const config = require('config');
const { check, validationResult } = require('express-validator');

const Category = require('../../models/Category');

// @route   POST api/category/create
// @desc    Create Category
// @access  Private
router.post(
  '/create',
  [check('name', 'Please inser category name').not().isEmpty()],
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

      //   res.json({ data });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error!');
    }
  }
);

module.exports = router;

const { Category } = require('../models');

const CategoryController = {
  createCategory: async (req, res) => {
    try {
      const category = await Category.create(req.body);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.findAll();
      res.status(200).json(categories);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = CategoryController;

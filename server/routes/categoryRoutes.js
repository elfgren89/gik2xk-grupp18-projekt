const express = require('express');
const CategoryController = require('../controllers/categoryController');
const router = express.Router();

// endpoint för att skapa en ny kategori
router.post('/', CategoryController.createCategory);

// endpoint för att hämta alla kategorier
router.get('/', CategoryController.getAllCategories);

module.exports = router;

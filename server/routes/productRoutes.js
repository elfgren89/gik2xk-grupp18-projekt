const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ProductController = require('../controllers/productController');
const Category = require('../models').Category;

const router = express.Router();

// funktion för att säkerställa att mapp existerar
const ensureDirSync = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    let categoryFolder = 'Default';
    if (req.body.categoryId) {
      try {
        const category = await Category.findByPk(req.body.categoryId);
        if (category) {
          categoryFolder = category.name;
        }
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    }

    const uploadPath = path.join(
      __dirname,
      '..',
      'uploads',
      'productImages',
      categoryFolder
    );
    ensureDirSync(uploadPath); // använder funktionen för att säkerställa mappen
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
// konfigurerar multer för bilduppladdningar
const upload = multer({ storage: storage });

// skapa en ny produkt med bild
router.post('/', upload.single('image'), ProductController.createProduct);

// uppdatera en produkt, med möjlighet att byta bild
router.put('/:id', upload.single('image'), ProductController.updateProduct);

// hämta alla produkter
router.get('/', ProductController.getAllProducts);
router.get('/:id', ProductController.getProductById);

// ta bort en produkt
router.delete('/:id', ProductController.deleteProduct);

module.exports = router;

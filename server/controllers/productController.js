const { Product, Category } = require('../models');
const fs = require('fs');
const path = require('path');

// hjälpfunktion för att säkerställa mappstruktur och hantera bilduppladdning
const handleImageUpload = async (categoryId, file) => {
  const category = await Category.findByPk(categoryId);
  const categoryFolder = category ? category.name : 'Uncategorized';
  const uploadDir = path.join(
    __dirname,
    '..',
    'uploads',
    'productImages',
    categoryFolder
  );

  // säkerställer att mappen finns
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // använder den uppladdade filens sökväg om en fil har laddats upp 
  if (file) {
    // omvandlar sökvägen till en relativ webb sökväg
    const relativePath = path
      .join('uploads', 'productImages', categoryFolder, file.filename)
      .replace(/\\/g, '/');
    return '/' + relativePath; // lägger till en inledande slash för att göra sökvägen relativ från serverns root
  }

  // returnerar null om ingen fil laddas upp
  return null;
};

const logRequestDetails = (req) => {
  console.log('Received fields:', req.body);
  console.log('Received file:', req.file);
};

const ProductController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.findAll({
        include: [
          {
            model: Category,
            as: 'category', // uppdaterar alias
          },
        ],
      });
      res.json(products);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id, {
        include: [
          {
            model: Category,
            as: 'category',
          },
        ],
      });
      if (product) {
        res.json(product);
      } else {
        res.status(404).send('Product not found');
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  createProduct: async (req, res) => {
    try {
      logRequestDetails(req); // loggar förfrågan för felsökning

      let { title, description, price, categoryId } = req.body;
      let imageUrl = req.body.imageUrl || '';

      // hanterar uppladdad bild
      if (req.file) {
        imageUrl = await handleImageUpload(categoryId, req.file);
      }

      if (!title || !description || price == null || !categoryId) {
        return res.status(400).send('Missing required fields');
      }

      const product = await Product.create({
        title,
        description,
        price,
        imageUrl,
        categoryId,
      });
      res.status(201).json(product);
    } catch (error) {
      console.error('Error in createProduct:', error);
      res.status(500).send(error.message);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body; // tar emot potentiella uppdateringar
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).send('Product not found');
      }

      let imageUrl = product.imageUrl;
      if (req.file) {
        // logik för att hantera uppladdning av ny bild
        imageUrl = await handleImageUpload(req.body.categoryId, req.file);
      }

      // uppdaterar endast de fält som skickas med i begäran
      const fieldsToUpdate = {};
      if (updates.title !== undefined) fieldsToUpdate.title = updates.title;
      if (updates.description !== undefined)
        fieldsToUpdate.description = updates.description;
      if (updates.price !== undefined) fieldsToUpdate.price = updates.price;
      if (updates.categoryId !== undefined)
        fieldsToUpdate.categoryId = updates.categoryId;
      if (imageUrl !== undefined) fieldsToUpdate.imageUrl = imageUrl;

      await product.update(fieldsToUpdate);
      res.json(product);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.findByPk(id);

      if (!product) {
        return res.status(404).send('Product not found');
      }

      // Ta bort produktbild från servern om den finns
      if (product.imageUrl) {
        const fullPath = path.join(__dirname, '..', product.imageUrl);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }

      await product.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = ProductController;

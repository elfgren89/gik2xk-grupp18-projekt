const express = require('express');
const router = express.Router({ mergeParams: true });
const ratingController = require('../controllers/ratingController');

// route för att lägga till betyg till produkt
// productId fångas upp i app.js
router.post('/', ratingController.addRating);

// route för att hämta alla betyg för en produkt
router.get('/ratings', ratingController.getProductRatings);

// route för att hämta genomsnittligt betyg för en produkt
router.get('/averageRating', ratingController.getProductAverageRating);

module.exports = router;

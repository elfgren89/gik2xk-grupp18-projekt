const { Rating, Product, Sequelize } = require('../models');
const { sequelize } = require('../models/index');

const RatingController = {
  // lägger till betyg för produkt
  addRating: async (req, res) => {
    const t = await sequelize.transaction();
    try {
      const productId = req.params.productId; // productId kommer från URL-parametern
      const { rating } = req.body; // rating-värdet skickas i request body

      // loggar information för felsökning
      console.log(`Attempting to add rating for product ID: ${productId}`, req.body);

      // skapar ett nytt betyg i databasen med transaktion
      const newRating = await Rating.create({
        productId,
        rating
      }, { transaction: t });

      // commitar transaktionen
      await t.commit();

      // loggar tillägg av betyg
      console.log(`Rating added to product ID: ${productId}`, newRating);

      res.status(201).json({ message: 'Rating added successfully' });
    } catch (error) {
      // om något går fel, rollbackar transaktionen
      await t.rollback();

      // loggar fel
      console.error('Error when trying to add rating:', error);

      res.status(500).send(error.message);
    }
  },

  // hämtar alla betyg för en specifik produkt
  getProductRatings: async (req, res) => {
    try {
      const productId = req.params.productId;
      const ratings = await Rating.findAll({
        where: { productId }
      });

      res.status(200).json(ratings);
    } catch (error) {
      console.error('Error fetching product ratings:', error);
      res.status(500).send(error.message);
    }
  },

// hämtar det genomsnittliga betyget för en specifik produkt
getProductAverageRating: async (req, res) => {
  try {
    const productId = req.params.productId;
    const productExists = await Product.findByPk(productId);
    if (!productExists) {
      return res.status(404).send('Product not found');
    }

    const avgRatingResult = await Rating.findAll({
      where: { productId },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.col('rating')), 'avgRating']
      ],
      raw: true,
    });

    // kontrollerar om resultat returneras
    if (avgRatingResult.length > 0 && avgRatingResult[0].avgRating !== null) {
      const avgRating = parseFloat(avgRatingResult[0].avgRating).toFixed(1);
      res.status(200).json({ averageRating: avgRating });
    } else {
      // om inga betyg finns för produkten, skicka tillbaka ett standardvärde eller indikera avsaknaden av betyg
      res.status(200).json({ message: 'No ratings available for this product', averageRating: 'Not available' });
    }
  } catch (error) {
    console.error('Error calculating average rating:', error);
    res.status(500).send(error.message);
  }
},
};

module.exports = RatingController;

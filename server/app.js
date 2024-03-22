const express = require('express');
const cors = require('cors');
const path = require('path');

// importerar route-moduler
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const cartRoutes = require('./routes/cartRoutes');
const userRoutes = require('./routes/userRoutes');
// const authRoutes = require('./routes/authRoutes'); //Kommentera bort för att aktivera authRoutes
const app = express();

// middleware
app.use(cors());
app.use(express.json()); // för att kunna tolka JSON i request bodies

// definierar routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products/:productId', ratingRoutes);
app.use('/api/products/:productId/ratings', ratingRoutes);
app.use('/api/cart', cartRoutes); // hanterar varukorgen
app.use('/api/users', userRoutes); // hanterar användare

// enkel route för att testa serverns status
app.get('/', (req, res) => {
  res.send('Servern körs och är redo att ta emot förfrågningar!');
});

// statisk filhantering för uppladdningar
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// felhanteringsmiddleware för att fånga och rapportera serverfel
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Något gick fel!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'Test' });
});

module.exports = app;

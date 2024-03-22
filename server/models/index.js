const Sequelize = require('sequelize');

// konfigurerar instans av Sequelize
const sequelize = new Sequelize('webshop', 'root', '', {
  host: '192.168.1.165',
  dialect: 'mariadb',
  logging: false, // aktiverar loggning för felsökning
});

// importerar modeller
const CartModel = require('./cart');
const CartItemModel = require('./cartItem');
const ProductModel = require('./product');
const UserModel = require('./user');
const RatingModel = require('./rating');
const CategoryModel = require('./category');

// initierar modeller
const Cart = CartModel(sequelize, Sequelize.DataTypes);
const CartItem = CartItemModel(sequelize, Sequelize.DataTypes);
const Product = ProductModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);
const Rating = RatingModel(sequelize, Sequelize.DataTypes);
const Category = CategoryModel(sequelize, Sequelize.DataTypes);

// samlar modeller i ett objekt
const db = {
  sequelize,
  Sequelize,
  Cart,
  CartItem,
  Product,
  User,
  Rating,
  Category,
};

// definierar relationer mellan modeller
db.User.hasMany(db.Cart);
db.Cart.belongsTo(db.User);

db.Cart.belongsToMany(db.Product, { through: db.CartItem });
db.Product.belongsToMany(db.Cart, { through: db.CartItem });

db.Product.hasMany(db.Rating);
db.Rating.belongsTo(db.Product);

db.Product.belongsTo(db.Category, { foreignKey: 'categoryId', as: 'category' });
db.Category.hasMany(db.Product, { foreignKey: 'categoryId' });

// kör associationsmetoder
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// synkroniserar alla modeller med databasen
sequelize.sync().then(() => {
  console.log('Databasen är synkroniserad');
});

// exporterar modeller och Sequelize-instansen
module.exports = db;

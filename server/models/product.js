const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Product extends Model {}

  Product.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'product',
      timestamps: true, // anges som true för att Sequelize ska hantera createdAt och updatedAt
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Product.associate = (db) => {
    // använder unikt alias för denna specifika association om det behövs
    Product.belongsTo(db.Category, { foreignKey: 'categoryId' });
    Product.belongsToMany(db.Cart, { through: db.CartItem });
  };

  return Product;
};

const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class CartItem extends Model {}

  CartItem.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    quantity: { // uppdaterat från 'amount' till 'quantity'
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'cartItem',
    timestamps: false, // eftersom vi manuellt definierar created_at och updated_at
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  CartItem.associate = (db) => {
    CartItem.belongsTo(db.Cart, { foreignKey: 'cartId', as: 'cart' });
    CartItem.belongsTo(db.Product, { foreignKey: 'productId' });
  };

  return CartItem;
};

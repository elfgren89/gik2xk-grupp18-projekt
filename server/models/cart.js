const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Cart extends Model {}

  Cart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      payed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'cart',
      timestamps: false,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Cart.associate = (db) => {
    Cart.belongsTo(db.User, { foreignKey: 'userId' });
    Cart.hasMany(db.CartItem, { foreignKey: 'cartId', as: 'cartItems' });
  };

  return Cart;
};

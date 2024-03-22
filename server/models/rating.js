const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Rating extends Model {}

  Rating.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE,
      rating: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: 'rating',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Rating.associate = (models) => {
    Rating.belongsTo(models.Product);
  };

  return Rating;
};

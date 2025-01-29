'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.hasMany(models.Cart,{
        foreignKey: 'product_id',
      })

      Product.hasMany(models.Wishlist, {
        foreignKey: 'product_id',
      });
    }
  }
  Product.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    price: DataTypes.DECIMAL,
    size: DataTypes.ARRAY(DataTypes.STRING),
    color: DataTypes.STRING,
    category: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    image_url: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Product',
  });
  return Product;
};
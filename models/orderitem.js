'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each OrderItem belongs to one Order
      OrderItem.belongsTo(models.Order, {
        foreignKey: 'order_id',
      });
    }
    
  }
  OrderItem.init({
    order_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    created_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'OrderItem',
  });
  return OrderItem;
};
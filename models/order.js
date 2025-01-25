'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Each Order has many OrderItems
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
      });
    }
    
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    total_price: DataTypes.DECIMAL,
    status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};
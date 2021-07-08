'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.belongsTo(models.Users, {
        foreignKey: 'created_by'
      });
    }
  };
  Category.init({
    name: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Category',
    tableName: 'categories'
  });
  return Category;
};
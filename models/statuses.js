'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Status extends Model {
    static associate(models) {
      Status.belongsTo(models.Users, {
        foreignKey: 'created_by'
      });
    }
  };
  Status.init({
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    created_by: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Status',
    tableName: 'statuses'
  });
  return Status;
};
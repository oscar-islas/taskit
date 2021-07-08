const bcrypt = require("bcryptjs");

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    static associate(models) {
      Users.hasMany(models.Category, {
        foreignKey: 'created_by',
        onDelete: 'cascade'
      });
      Users.hasMany(models.Task, {
        foreignKey: 'user_id'
      });
      Users.hasMany(models.Status, {
        foreignKey: 'created_by'
      });
    }
  };
  Users.init({
    firstname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    lastname: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    profile_photo: DataTypes.STRING,
    active: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Users',
    tableName: 'users'
  });

  Users.beforeCreate(async(user) => {
    try{
      let hash = await bcrypt.hash(user.password, 8); //Generamos el hash
      user.password = hash; //Asignamos el hash a la contraseña que se agregará a la DB
      return user.password; //Finalizamos
    }catch(error){
      throw new Error("No se pudo encriptar la contraseña");
    }
  });

  return Users;
};
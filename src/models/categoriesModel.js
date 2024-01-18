const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection.js');

const Categories = sequelize.define(
  'categories',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Name of category cannot be empty',
        },
        isString(value) {
          if (typeof value !== 'string') {
            throw new Error('Name of category must be a string');
          }
        },
      },
    },
  },
  {
    tableName: 'categories',
    timestamps: false,
  }
);

module.exports = Categories;

const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection.js');

const Currencies = sequelize.define(
  'currencies',
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
          msg: 'Name of currency cannot be empty',
        },
        isString: (value) => {
          if (typeof value !== 'string') {
            throw new Error('currency name must be a string');
          }
        },
      },
    },
  },
  {
    tableName: 'currencies',
    timestamps: false,
  }
);

module.exports = Currencies;

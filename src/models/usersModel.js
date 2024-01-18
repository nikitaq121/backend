const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection.js');
const Currencies = require('./currencyModel.js');

const Users = sequelize.define(
  'users',
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
          msg: 'Username cannot be empty',
        },
        isString: (value) => {
          if (typeof value !== 'string') {
            throw new Error('Username must be a string');
          }
        },
      },
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false,

      validate: {
        isCurrencyExists: async function (value) {
          if (value !== undefined) {
            const currency = await Currencies.findOne({
              where: { name: value },
            });
            if (!currency) {
              throw new Error('Currency with the specified id does not exist');
            }
          }
        },
      },
    },
  },
  {
    tableName: 'users',
    timestamps: false,
  }
);

module.exports = Users;

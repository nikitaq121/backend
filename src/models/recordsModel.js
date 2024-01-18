const { DataTypes } = require('sequelize');
const sequelize = require('../dbConnection.js');
const Users = require('./usersModel');
const Categories = require('./categoriesModel');
const Currencies = require('./currencyModel');

const Records = sequelize.define(
  'records',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'idUser must be an integer',
        },
        isExistingUser: async function (value) {
          const user = await Users.findByPk(value);
          if (!user) {
            throw new Error('User with the specified id does not exist');
          }
        },
      },
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Id of category must be an integer',
        },
        isExistingCategory: async function (value) {
          const category = await Categories.findByPk(value);
          if (!category) {
            throw new Error('Category with the specified id does not exist');
          }
        },
      },
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      validate: {
        isDate: {
          msg: 'Invalid date format',
        },
      },
    },
    expenseSum: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        isFloat: {
          msg: 'expenseSum must be a float',
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
              throw new Error('the specified currency does not exist');
            }
          }
        },
      },
    },
  },
  {
    tableName: 'records',
    timestamps: false,
  }
);

module.exports = Records;

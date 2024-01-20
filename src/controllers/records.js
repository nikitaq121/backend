const { Router } = require('express');
const Records = require('../models/recordsModel');
const Categories = require('../models/categoriesModel');
const Users = require('../models/usersModel');
const routes = Router();

routes.post('/', async (req, res) => {
  try {
    let { categoryId, expenseSum, currency } = req.body;
    const userId = req.user.id;

    const category = await Categories.findByPk(categoryId);
    const user = await Users.findByPk(userId);
    if (!category || !user) {
      res.status(404).json({ error: 'Category or user does not exist' });
      return;
    }
    currency = currency ? currency.toUpperCase() : user.currency;

    const newRecord = await Records.create({
      userId,
      categoryId,
      expenseSum,
      currency,
    });

    res.status(200).json(newRecord);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: error.message });
  }
});

routes.get('/', async (req, res) => {
  try {
    const { userId, categoryId } = req.query;
    if (+userId !== +req.user.id) {
      res.status(403).json({ error: 'Access denied for this action' });
      return;
    }
    let records;

    if (userId && categoryId) {
      records = await Records.findAll({
        where: { userId: userId, categoryId: categoryId },
      });
    } else if (userId) {
      records = await Records.findAll({
        where: { userId: userId },
      });
    } else if (categoryId) {
      records = await Records.findAll({
        where: { categoryId: categoryId },
      });
    } else {
      throw new Error('Missing query parameters');
    }

    res.status(200).json(records);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Records.findByPk(id);

    if (!record) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }
    if (+record.userId !== +req.user.id) {
      res.status(403).json({ error: 'Access denied for this action' });
      return;
    }
    res.status(200).json(record);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Records.findByPk(id);

    if (!record) {
      res.status(404).json({ error: 'Record not found' });
      return;
    }

    if (+record.userId !== +req.user.id) {
      res.status(403).json({ error: 'Access denied for this action' });
      return;
    }
    await Records.destroy({
      where: {
        id: record.id,
      },
    });

    res.status(200).json(record);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = routes;

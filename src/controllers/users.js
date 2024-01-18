const { Router } = require('express');
const Users = require('../models/usersModel');
const Currencies = require('../models/currencyModel');
const routes = Router();

routes.post('/', async (req, res) => {
  try {
    let { name, currency } = req.body;

    if (currency === null || currency === undefined) {
      const firstCurrency = await Currencies.findOne();
      if (firstCurrency === null || firstCurrency === undefined) {
        throw new Error('No currencies found in the database.');
      }

      currency = firstCurrency.dataValues.name;
    } else {
      currency = currency.toUpperCase();
    }

    const newUser = await Users.create({
      name,
      currency,
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: error.message });
  }
});

routes.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, currency } = req.body;
    const user = await Users.findByPk(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    } else {
      await Users.update(
        { name, currency },
        {
          where: {
            id: id,
          },
        }
      );
    }
    res.status(200).json('Information updated successfully');
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: error.message });
  }
});

routes.get('/', async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await Users.findByPk(id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    await Users.destroy({
      where: {
        id: user.id,
      },
    });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = routes;

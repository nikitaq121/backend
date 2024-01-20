const { Router } = require('express');
const Users = require('../models/usersModel');
const Currencies = require('../models/currencyModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const authControl = require('../authorizationMiddleware.js');
const routes = Router();

const generateToken = (id) => {
  const info = {
    id,
  };
  return jwt.sign(info, process.env.JWT_KEY, { expiresIn: '2h' });
};

routes.post('/registration', async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: 'Error during registration', errors });
    }
    let { name, password, currency } = req.body;
    console.log(req.body);
    const candidate = await Users.findOne({ where: { name } });
    if (candidate) {
      return res
        .status(400)
        .json({ message: 'User with this name already exists' });
    }

    if (currency === null || currency === undefined) {
      const firstCurrency = await Currencies.findOne();
      if (firstCurrency === null || firstCurrency === undefined) {
        throw new Error('No currencies found in the database.');
      }

      currency = firstCurrency.dataValues.name;
    } else {
      currency = currency.toUpperCase();
    }

    const hashPassword = bcrypt.hashSync(password, 7);
    console.log({ name, password: hashPassword, currency });
    const user = await Users.create({ name, password: hashPassword, currency });

    return res.json({ id: user.id, name, password });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;
    const user = await Users.findOne({ where: { name } });
    if (!user) {
      return res.status(400).json({ message: `User ${name} is not found` });
    }
    const validPassword = bcrypt.compareSync(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: `Invalid password` });
    }
    const token = generateToken(user.id);
    return res.json({ token });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: 'Login error' });
  }
});

routes.put('/:id', authControl, async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, req.user.id);
    if (+id !== +req.user.id) {
      res.status(403).json({ error: 'Access denied for this action' });
      return;
    }

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

routes.get('/', authControl, async (req, res) => {
  try {
    const users = await Users.findAll();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.get('/:id', authControl, async (req, res) => {
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

routes.delete('/:id', authControl, async (req, res) => {
  try {
    const { id } = req.params;
    if (+id !== +req.user.id) {
      res.status(403).json({ error: 'Access denied for this action' });
      return;
    }

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

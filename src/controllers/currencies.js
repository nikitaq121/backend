const { Router } = require('express');
const Currencies = require('../models/currencyModel');
const routes = Router();

routes.post('/', async (req, res) => {
  try {
    let { name } = req.body;
    name = name.toUpperCase();
    const newCurrency = await Currencies.create({
      name,
    });

    res.status(200).json(newCurrency);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: error.message });
  }
});

routes.get('/', async (req, res) => {
  try {
    const currencies = await Currencies.findAll();
    res.status(200).json(currencies);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currencies.findByPk(id);

    if (!currency) {
      res.status(404).json({ error: 'Currency not found' });
      return;
    }

    res.status(200).json(currency);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const currency = await Currencies.findByPk(id);

    if (!currency) {
      res.status(404).json({ error: 'Currency not found' });
      return;
    }

    await Currencies.destroy({
      where: {
        id: currency.id,
      },
    });

    res.status(200).json(currency);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = routes;

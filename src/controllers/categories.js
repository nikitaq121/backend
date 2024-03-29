const { Router } = require('express');
const Categories = require('../models/categoriesModel');
const routes = Router();

routes.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    const newCategory = await Categories.create({
      name,
    });

    res.status(200).json(newCategory);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: error.message });
  }
});

routes.get('/', async (req, res) => {
  try {
    const categories = await Categories.findAll();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByPk(id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

routes.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Categories.findByPk(id);

    if (!category) {
      res.status(404).json({ error: 'Category not found' });
      return;
    }

    await Categories.destroy({
      where: {
        id: category.id,
      },
    });

    res.status(200).json(category);
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = routes;

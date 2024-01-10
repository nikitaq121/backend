import { Router } from 'express';
import crypto from 'crypto';

const routes = Router();
const categories = [];

routes.post('/', (req, res) => {
  const { name } = req.body;
  const category = { name, id: crypto.randomUUID() };
  categories.push(category);
  res.status(201).send(category);
});

routes.get('/', (req, res) => {
  res.status(200).send(categories);
});

routes.get('/:id', (req, res) => {
  const { id } = req.params;
  const category = categories.find((category) => category.id === id);
  if (!category) {
    res.status(404).send({ error: 'Category not found' });
  }
  res.status(200).send(category);
});

routes.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const categoryIndex = categories.findIndex((category) => category.id === id);
  if (categoryIndex < 0) {
    res.status(404).send({ error: 'Category not found' });
  }
  const category = { name, id };
  categories[categoryIndex] = category;
  res.status(200).send(category);
});

routes.delete('/:id', (req, res) => {
  const { id } = req.params;
  const categoryIndex = categories.findIndex((category) => category.id === id);
  if (categoryIndex < 0) {
    res.status(404).send({ error: 'Category not found' });
  }
  categories.splice(categoryIndex, 1);
  res.status(204).send();
});

export default routes;

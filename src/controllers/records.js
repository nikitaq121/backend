import { Router } from 'express';
import crypto from 'crypto';

const routes = Router();
const records = [];

routes.post('/', (req, res) => {
  const { userId, categoryId, expenseSum } = req.body;
  const record = {
    userId,
    categoryId,
    expenseSum,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  records.push(record);
  res.status(201).send(record);
});

routes.get('/', (req, res) => {
  const { userId, categoryId } = req.query;
  if (!userId && !categoryId) {
    return res.status(400).send({ message: 'Missing query parameters userId or categoryId' });
  }

  const filteredRecords = [];

  if (userId) {
    const recordsWithUserId = records.filter(
      (u) => u.userId === userId && !filteredRecords.includes(u)
    );
    filteredRecords.push(...recordsWithUserId);
  }

  if (categoryId) {
    const recordsWithCategoryId = records.filter(
      (u) => u.categoryId === categoryId && !filteredRecords.includes(u)
    );
    filteredRecords.push(...recordsWithCategoryId);
  }

  if (filteredRecords.length === 0) {
    return res.status(404).send({ message: 'No records found' });
  }

  return res.status(200).send(filteredRecords);
});

routes.get('/:id', (req, res) => {
  const { id } = req.params;
  const record = records.find((record) => record.id === id);
  if (!record) {
    res.status(404).send({ error: 'Record not found' });
  }
  res.status(200).send(record);
});

routes.put('/:id', (req, res) => {
  const { id } = req.params;
  const { userId, categoryId, expenseSum } = req.body;
  const recordIndex = records.findIndex((record) => record.id === id);
  if (recordIndex < 0) {
    res.status(404).send({ error: 'Record not found' });
  }
  const record = {
    ...records[recordIndex],
    userId,
    categoryId,
    expenseSum,
  };
  records[recordIndex] = record;
  res.status(200).send(record);
});

routes.delete('/:id', (req, res) => {
  const { id } = req.params;
  const recordIndex = records.findIndex((record) => record.id === id);
  if (recordIndex < 0) {
    res.status(404).send({ error: 'Record not found' });
  }
  records.splice(recordIndex, 1);
  res.status(204).send();
});

export default routes;

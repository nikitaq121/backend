const express = require('express');
const cors = require('cors');
const { config } = require('dotenv');
const healthCheck = require('./controllers/healthCheck');
const users = require('./controllers/users');
const categories = require('./controllers/categories');
const records = require('./controllers/records');
const currencies = require('./controllers/currencies');
const authControl = require('./authorizationMiddleware.js');

config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/healthCheck', healthCheck);

app.use('/users', users);

app.use('/categories', authControl, categories);

app.use('/records', authControl, records);

app.use('/currencies', authControl, currencies);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

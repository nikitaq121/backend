import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import healthCheck from './controllers/healthCheck.js';
import users from './controllers/users.js';
import categories from './controllers/categories.js';
import records from './controllers/records.js';

config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/healthCheck', healthCheck);

app.use('/users', users);

app.use('/categories', categories);

app.use('/records', records);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

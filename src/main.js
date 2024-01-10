import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import healthCheck from './controllers/healthCheck.js';
import users from './controllers/users.js';

config();

const app = express();

app.use(cors());

app.use(express.json());

app.use('/healthCheck', healthCheck);
app.use('/users', users)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import routes from './controllers/healthCheck.js';
config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

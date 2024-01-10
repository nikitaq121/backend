import { Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  const date = new Date().toISOString();
  res.status(200).json({ server_status: 'Server is healthy', check_time: date });
});

export default routes;

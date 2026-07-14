import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.mjs';
import errorHandler from './middleware/errorHandler.mjs';

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is working' });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;

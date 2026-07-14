import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.mjs';
import errorHandler from './middleware/errorHandler.mjs';

const app = express();

app.use(cors());

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];

  if (!methodsWithBody.includes(req.method)) {
    return next();
  }

  if (Buffer.isBuffer(req.body) && req.body.length > 0) {
    try {
      req.body = JSON.parse(req.body.toString('utf8'));
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' });
    }
  }

  next();
});
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is working' });
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;

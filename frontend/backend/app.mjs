import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.mjs';
import errorHandler from './middleware/errorHandler.mjs';

const app = express();

app.use(
  cors({
    origin: 'https://tourmaline-tarsier-97df31.netlify.app'
  })
);

app.use(express.json());

app.get('/hello', (req, res) => {
  res.json({ message: 'Backend is working' });
});

app.use('/', routes);
app.use(errorHandler);

export default app;

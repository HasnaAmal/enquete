import serverless from 'serverless-http';
import app from '../../backend/app.mjs';

export const handler = serverless(app);

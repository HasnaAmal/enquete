import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import routes from './routes/index.mjs';
import errorHandler from './middleware/errorHandler.mjs';

const app = express();

app.enable('trust proxy');

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

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

const ADMIN_COOKIE_NAME = 'admin_token';

function createAdminToken() {
  return jwt.sign(
    {
      role: 'admin',
      email: process.env.ADMIN_EMAIL,
    },
    process.env.AUTH_SECRET,
    {
      expiresIn: '7d',
    }
  );
}

function requireAdmin(req, res, next) {
  const token = req.cookies?.[ADMIN_COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);

    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.admin = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid session' });
  }
}

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Backend is working' });
});

app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.AUTH_SECRET) {
    return res.status(500).json({ error: 'Admin auth is not configured on the server.' });
  }

  if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const token = createAdminToken();

  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    ok: true,
    admin: {
      email: process.env.ADMIN_EMAIL,
      role: 'admin',
    },
  });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
  });

  return res.json({ ok: true });
});

app.get('/api/admin/me', requireAdmin, (req, res) => {
  return res.json({
    authenticated: true,
    admin: {
      email: req.admin.email,
      role: req.admin.role,
    },
  });
});

app.use('/api', (req, res, next) => {
  const adminOnlyRoutes = [
    { method: 'GET', pattern: /^\/forms$/ },
    { method: 'POST', pattern: /^\/forms$/ },
    { method: 'PUT', pattern: /^\/forms\/[^/]+$/ },
    { method: 'DELETE', pattern: /^\/forms\/[^/]+$/ },
    { method: 'POST', pattern: /^\/forms\/[^/]+\/questions$/ },
    { method: 'GET', pattern: /^\/forms\/[^/]+\/responses$/ },
  ];

  const isProtected = adminOnlyRoutes.some(
    (route) => route.method === req.method && route.pattern.test(req.path)
  );

  if (!isProtected) {
    return next();
  }

  return requireAdmin(req, res, next);
});

app.use('/api', routes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.use(errorHandler);

export default app;

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

const globalForPrisma = globalThis;

const pool =
  globalForPrisma.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL
  });

const adapter = new PrismaPg(pool);

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.pgPool = pool;
  globalForPrisma.prisma = prisma;
}

export { prisma };

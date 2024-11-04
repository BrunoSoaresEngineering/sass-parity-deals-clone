/* eslint-disable import/no-extraneous-dependencies */
import { env } from '@/data/env/server';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './src/db/migrations',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  strict: true,
  verbose: true,
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});

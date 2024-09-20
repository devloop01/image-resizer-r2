import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';

import 'dotenv/config';

import { resizeRoute } from './routes/resize/resize.route';

const app = new Hono();

app.use(logger());

app.get('/', (c) => c.text('Hello Hono!'));

const api = new Hono();
api.route('/resize', resizeRoute);

app.route('/api', api);

const port = 3000;
console.log(`Server is running on port ${port}`);

serve({ fetch: app.fetch, port });

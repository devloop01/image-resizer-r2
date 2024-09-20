import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';

import 'dotenv/config';

import { resizeRoute } from './routes/resize/resize.route.js';

const app = new Hono();

app.use('*', cors());
app.use(logger());

app.get('/', (c) => c.text('Hello Hono!'));

const api = new Hono();
api.route('/resize', resizeRoute);

app.route('/api', api);

const HOST = '0.0.0.0';
const PORT = parseInt(process.env.PORT || '3000');

console.log(`Server is running on port ${PORT}`);

serve({
	fetch: app.fetch,
	hostname: HOST,
	port: PORT
});

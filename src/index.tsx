/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 *
 */

import { Hono } from 'hono';
import { poweredBy } from 'hono/powered-by';
import { logger } from 'hono/logger';
import { createMiddleware } from 'hono/factory';

import { Error } from './components';

const app = new Hono<{ Bindings: Env }>();

// Middleware to check the authentication header for POST requests
const authMiddleware = createMiddleware(async (c, next) => {
  const authHeader = c.req.header('Authorization');
  const expectedAuthToken = c.env.AUTH_KEY;

  if (authHeader !== `Bearer ${expectedAuthToken}`) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
  await next();
});

// POST route to create a short URL (with authentication)
app.post('/', authMiddleware, async (c) => {
  const { longUrl } = await c.req.json();
  if (!longUrl) {
    return c.json({ error: 'Invalid input' }, 400);
  }

  // Generate a random short code
  const shortCode = Math.random().toString(36).substring(2, 8);

  // Store the long URL with the short code as the key
  await c.env.URLS.put(shortCode, longUrl);

  return c.json({
    code: shortCode,
    url: `https://${c.env.DOMAIN}/${shortCode}`,
  });
});

// GET route to retrieve the long URL (no authentication required)
app.get('/:code', async (c) => {
  const longUrl = await c.env.URLS.get(c.req.param('code'));

  if (!longUrl) {
    return c.notFound();
  }

  return c.redirect(longUrl, 302);
});

app.notFound((c) => {
  return c.render(
    <Error title="404 Not Found" code="404">
      Sorry that url doesn&apos;t seem to exist.
    </Error>,
  );
});

app.onError((err, c) => {
  return c.render(
    <Error title={err.name} code="500">
      {err.message}
    </Error>,
  );
});

// Apply middleware to add logger and "Powered by Hono" header
app.use('*', logger(), poweredBy());

export default app;

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
import { HTTPException } from 'hono/http-exception';
import { logger } from 'hono/logger';
import { createMiddleware } from 'hono/factory';
import { validator } from 'hono/validator';
import { nanoid } from 'nanoid';
import { z } from 'zod';

import { Error } from './components';

const app = new Hono<{ Bindings: Env }>();

const payloadSchema = z.object({
  longUrl: z.string().url('Invalid URL'),
});

const regex = /^[a-zA-Z0-9]{6}$/;
const paramSchema = z.object({
  // code: z.string().nanoid(), // https://github.com/colinhacks/zod/pull/4004
  code: z.string().regex(new RegExp(regex)),
});

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
app.post(
  '/',
  authMiddleware,
  validator('json', (value, c) => {
    const parsed = payloadSchema.safeParse(value);
    if (!parsed.success) {
      return c.json({ error: 'Invalid Url!' }, 400);
    }
    return parsed.data;
  }),
  async (c) => {
    const { longUrl } = c.req.valid('json');

    // Generate a random short code
    const shortCode = nanoid(6);

    // Store the long URL with the short code as the key
    await c.env.URLS.put(shortCode, longUrl);

    return c.json({
      code: shortCode,
      url: `https://${c.env.DOMAIN}/${shortCode}`,
    });
  },
);

// GET route to retrieve the long URL (no authentication required)
app.get(
  '/:code',
  validator('param', (value) => {
    const parsed = paramSchema.safeParse(value);
    if (!parsed.success) {
      throw new HTTPException(400, {
        message: 'Seems like an invalid shortcode.',
      });
    }
    return parsed.data;
  }),
  async (c) => {
    const { code } = c.req.valid('param');
    const longUrl = await c.env.URLS.get(code);

    if (!longUrl) {
      return c.notFound();
    }

    return c.redirect(longUrl, 302);
  },
);

app.notFound((c) => {
  return c.render(
    <Error title="404 Not Found" code="404">
      Sorry that url doesn&apos;t seem to exist.
    </Error>,
  );
});

app.onError((err, c) => {
  let statusCode = 500;
  if (err instanceof HTTPException) {
    // Get the custom response
    const httpError = err.getResponse();
    statusCode = httpError.status;
  }

  return c.render(
    <Error title={err.name} code={statusCode}>
      {err.message}
    </Error>,
  );
});

// Apply middleware to add logger and "Powered by Hono" header
app.use('*', logger(), poweredBy());

export default app;

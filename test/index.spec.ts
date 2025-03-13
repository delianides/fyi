// test/index.spec.ts
import {
  env,
  createExecutionContext,
  waitOnExecutionContext,
  SELF,
} from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Hello World worker', () => {
  it('responds with Hello World! (unit style)', async () => {
    const request = new IncomingRequest('http://example.com');
    // Create an empty context to pass to `worker.fetch()`.
    const ctx = createExecutionContext();
    const response = await worker.fetch(request, env, ctx);
    // Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
    await waitOnExecutionContext(ctx);
    expect(await response.text()).toMatchInlineSnapshot(
      `"<html><head><title>404 Not Found</title><link rel="icon" type="image/png" href="/static/favicon-96x96.png" sizes="96x96"/><link rel="icon" type="image/svg+xml" href="/static/favicon.svg"/><link rel="shortcut icon" href="/static/favicon.ico"/><link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png"/><meta name="apple-mobile-web-app-title" content="AJD"/><link rel="manifest" href="/static/site.webmanifest"/><script src="https://unpkg.com/@tailwindcss/browser@4"></script></head><body class="bg-gray-900"><div class="h-screen flex items-center justify-center"><div class="text-center"><h1 class="text-4xl font-mono font-bold text-gray-100">404</h1><h4 class="text-md font-mono font-bold text-gray-300">Sorry that url doesn&#39;t seem to exist.</h4></div></div></body></html>"`,
    );
  });

  it('responds with Hello World! (integration style)', async () => {
    const response = await SELF.fetch('https://example.com');
    expect(await response.text()).toMatchInlineSnapshot(
      `"<html><head><title>404 Not Found</title><link rel="icon" type="image/png" href="/static/favicon-96x96.png" sizes="96x96"/><link rel="icon" type="image/svg+xml" href="/static/favicon.svg"/><link rel="shortcut icon" href="/static/favicon.ico"/><link rel="apple-touch-icon" sizes="180x180" href="/static/apple-touch-icon.png"/><meta name="apple-mobile-web-app-title" content="AJD"/><link rel="manifest" href="/static/site.webmanifest"/><script src="https://unpkg.com/@tailwindcss/browser@4"></script></head><body class="bg-gray-900"><div class="h-screen flex items-center justify-center"><div class="text-center"><h1 class="text-4xl font-mono font-bold text-gray-100">404</h1><h4 class="text-md font-mono font-bold text-gray-300">Sorry that url doesn&#39;t seem to exist.</h4></div></div></body></html>"`,
    );
  });
});

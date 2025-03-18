# fyi

A very primative URL shortener using Cloudflare Workers, KV, and Hono.

## Installation

Make sure to install [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/)
and sign up for a free [Cloudflare](https://www.cloudflare.com/plans/developer-platform/) account. It's
helpful if you have a short domain already set up in Cloudflare, as this allows
you to attach the domain to your worker.

You'll also need to create a KV store. Wrangler's local KV support is pretty
handy—when you run it locally, it uses SQLite under the hood, so you can
interact with the same bindings you would in production without the overhead of
running a separate KV store. It is possible to use
wrangler to [create a KV store](https://developers.cloudflare.com/kv/get-started/#2-create-a-kv-namespace) in your terminal.

Once you clone the repo, run:

```bash
npm i
```

To start the project you just need to run:

```bash
npm run dev
```

If you need to regenerate types for TypeScript, you can execute
the following command to regenerate them:

```bash
npm run cf-typegen
```

There is also a script in the repo to generate a secure `AUTH_KEY` that needs to
be used in some of the API requests. If you run:

`./scripts/create_token.sh`

It will create or update the `.dev.vars` file with an `AUTH_KEY` and output the
command you would need to run to add a production key to your Cloudflare
account. Make sure you keep track of this key because its not stored anywhere
and cannot be retrieved if its lost. If you did lose it, simply create a new
token and update any integrations that are using the old token.

## Features

- Simple endpoints to create and access short links.
- Use nanoid to generate URL-friendly compatible short codes.
- Use Hono's built-in JSX support to render error pages if a link has been
  removed or is missing.
- Tailwindcss for styling error pages.
- Growing Test Suite
- Under 10ms CPU compute which allows this to be executed in a free account.

## Customize

- If you have a domain and KV setup already, just modify the `.vars.dev` and
  `wrangler.toml` file to account for your domain.

- You can update the styling for error pages how ever you'd like.

## Extra

You can use this with a tool like [Dropshare](https://dropshare.app) to create
shortlinks but also share screenshots and videos. Follow the [setup
guide](https://support.dropshare.app/hc/en-us/articles/201268771-How-to-set-up-a-custom-URL-shortener)
in order use their landing pages or use the route to query the image and serve
it from the worker directly.

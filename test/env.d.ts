declare module 'cloudflare:test' {
  // Controls the type of `import("cloudflare:test").env`
  // @ts-expect-error For CF Testing
  // eslint-disable-next-line
  interface ProvidedEnv extends Env {}
}

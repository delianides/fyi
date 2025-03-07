export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <div className="container flex max-w-md flex-col items-center justify-center gap-6 px-4 py-16 text-center md:py-24">
        <div className="space-y-2">
          <h1 className="text-9xl font-bold tracking-tighter text-primary">
            404
          </h1>
          <h2 className="text-3xl font-bold tracking-tight">Page not found</h2>
          <p className="text-muted-foreground md:text-xl/relaxed">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>
      </div>
    </div>
  );
}

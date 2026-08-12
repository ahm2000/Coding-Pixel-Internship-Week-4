export default function About() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">About</h1>
      <p className="text-zinc-500 mt-2">
        This page lives at <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded">app/(marketing)/about/page.tsx</code>, but the route is still{' '}
        <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded">/about</code> - a parenthesized folder is a route group, it organizes files without adding a URL segment.
      </p>
    </main>
  );
}

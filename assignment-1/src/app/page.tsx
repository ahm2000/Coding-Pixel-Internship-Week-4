export default function Home() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Routing Drills</h1>
      <p className="text-zinc-500 mt-2">
        This is <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded">app/page.tsx</code> - the route for <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded">/</code>.
      </p>
      <p className="text-zinc-500 mt-4">
        Try typing in the search box above, then click Dashboard - the header never remounts, so your text stays put.
      </p>
    </main>
  );
}

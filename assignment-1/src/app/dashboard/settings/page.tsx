export default function Settings() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-zinc-900">Settings</h1>
      <p className="text-zinc-500 mt-2">
        <code className="font-mono text-sm bg-zinc-100 px-1.5 py-0.5 rounded">/dashboard/settings</code> - a nested route under the dashboard segment. It inherits the dashboard layout&apos;s breadcrumbs without repeating any of that code.
      </p>
    </div>
  );
}

'use client';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-xl p-5">
      <h2 className="font-semibold text-red-700">Something broke</h2>
      <p className="text-sm text-red-600 mt-1">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}

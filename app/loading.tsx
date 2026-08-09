export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 text-slate-900">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card text-center">
        <p className="text-lg font-medium">Loading Parali-to-Prosper…</p>
        <div className="mt-4 h-2 w-24 animate-pulse rounded-full bg-primary/30"></div>
      </div>
    </div>
  );
}

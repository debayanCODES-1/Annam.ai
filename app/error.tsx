'use client';

import Link from 'next/link';

export default function GlobalError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 text-slate-900">
      <div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-semibold">Something broke</h1>
        <p className="mt-4 text-slate-600">The app encountered an issue. Please try again or refresh the page.</p>
        <Link href="/" className="mt-6 inline-flex rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary/90">
          Go back home
        </Link>
      </div>
    </div>
  );
}

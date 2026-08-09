import Link from 'next/link';

export default function CoordinatorHelpPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-semibold text-slate-900">Coordinator help</h1>
        <p className="mt-4 text-slate-600">Information for coordinators and district managers is coming in the next module.</p>
        <Link
          href="/coordinator/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50"
        >
          Back to coordinator dashboard
        </Link>
      </div>
    </main>
  );
}

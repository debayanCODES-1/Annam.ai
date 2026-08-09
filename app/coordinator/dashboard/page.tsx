import Link from 'next/link';

export default function CoordinatorDashboardPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">District coordinator</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">View district metrics</h1>
          <p className="mt-3 text-slate-600">Monitor residue risk, machinery availability, biomass demand and early warnings for Punjab districts.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/coordinator/help" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50">
              Coordinator help
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

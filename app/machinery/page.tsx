import Link from 'next/link';

export default function MachineryPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-500">Machinery provider</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Manage your equipment</h1>
          <p className="mt-3 text-slate-600">Create listings, review booking requests and mark machines available for Punjab stubble management.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/machinery/dashboard" className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-3 text-base font-semibold text-slate-900 hover:bg-amber-400">
              Provider dashboard
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

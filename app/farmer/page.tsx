import Link from 'next/link';

export default function FarmerPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Farmer demo</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900">Welcome, Punjab farmer</h1>
          <p className="mt-3 text-slate-600">This demo will guide you through onboarding, residue management and recommended farm actions.</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="/farmer/onboarding" className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary/90">
              Start onboarding
            </Link>
            <Link href="/farmer/help" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50">
              View help
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

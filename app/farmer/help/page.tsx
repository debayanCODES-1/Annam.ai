import Link from 'next/link';

export default function FarmerHelpPage() {
  return (
    <main className="mx-auto min-h-screen max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <h1 className="text-3xl font-semibold text-slate-900">Farmer help</h1>
        <p className="mt-4 text-slate-600">Tips for using the demo: onboard your farm, review residue recommendations, and explore equipment near your village.</p>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Next steps</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Complete onboarding to see your farm dashboard.</li>
            <li>Use the farmer dashboard to compare crop and residue options.</li>
            <li>Return to the landing page to explore provider and coordinator demos.</li>
          </ul>
        </div>
        <Link
          href="/farmer/dashboard"
          className="mt-6 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white hover:bg-primary/90"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}

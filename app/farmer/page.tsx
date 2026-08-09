import Link from 'next/link';

export default function FarmerPage() {
  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section className="glass-panel rounded-[2.5rem] border border-white/80 bg-white/80 p-8 shadow-card card-3d">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Farmer demo</p>
              <h1 className="mt-4 text-4xl font-semibold text-slate-950 sm:text-5xl">Welcome, Punjab farmer</h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Access residue market signals, precision machinery booking, and crop recommendations tailored to your farm’s soil, irrigation, and harvest schedule.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/farmer/onboarding" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800">
                Start onboarding
              </Link>
              <Link href="/farmer/help" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50">
                View help
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[2rem] bg-slate-950/5 p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Residue marketplace</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">Sell farm residue to nearby buyers</p>
            </div>
            <div className="rounded-[2rem] bg-slate-950/5 p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Precision booking</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">Schedule machinery on the best available slot</p>
            </div>
            <div className="rounded-[2rem] bg-slate-950/5 p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Crop planning</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">Get water-smart crop guidance for your soil</p>
            </div>
            <div className="rounded-[2rem] bg-slate-950/5 p-5 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Action alerts</p>
              <p className="mt-4 text-lg font-semibold text-slate-950">Know when harvest urgency is rising</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="glass-panel rounded-[2.5rem] border border-white/80 p-8 shadow-card card-3d">
            <h2 className="text-2xl font-semibold text-slate-950">Farmer product experience</h2>
            <p className="mt-3 text-slate-600">This demo connects your farm profile with market pricing, machinery availability, and crop recommendations so you can act on residue value faster.</p>
            <div className="mt-6 space-y-4">
              <div className="rounded-[2rem] bg-white p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Smart recommendations</p>
                <p className="mt-2 text-slate-700">Receive a tailored action plan for residue handling, machinery booking, and buyer matching.</p>
              </div>
              <div className="rounded-[2rem] bg-white p-5 shadow-sm">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Connected workflows</p>
                <p className="mt-2 text-slate-700">Book equipment, compare crop options, and manage product pricing from one demo dashboard.</p>
              </div>
            </div>
          </div>
          <div className="rounded-[2.5rem] bg-slate-950/5 p-7 shadow-card card-3d">
            <h3 className="text-xl font-semibold text-slate-950">Farmer tools available</h3>
            <ul className="mt-5 space-y-3 text-sm text-slate-700">
              <li>• Residue value estimate and market comparison</li>
              <li>• Nearby provider booking and cost estimate</li>
              <li>• Crop comparison by water, income, and residue trends</li>
              <li>• Weather-aware harvest urgency alerts</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}

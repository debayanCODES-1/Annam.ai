import Link from 'next/link';
import { Droplet, Leaf, Sparkles, Wind } from 'lucide-react';

const impactCards = [
  {
    title: 'Reduce stubble burning',
    description: 'Protect air quality with residue alternatives and local support.',
    icon: Wind,
  },
  {
    title: 'Save water',
    description: 'Compare crop water use and choose more sustainable planting.',
    icon: Droplet,
  },
  {
    title: 'Create residue income',
    description: 'Find buyers and machinery for residue recycling and compost.',
    icon: Leaf,
  },
];

export default function Home() {
  return (
    <main className="relative overflow-hidden pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(16,185,129,0.14),_transparent_25%)] blur-3xl" />
      <section className="relative mx-auto flex min-h-[88vh] max-w-7xl flex-col gap-10 px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.9fr] lg:items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-slate-900/10 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur-xl">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              Fresh farming toward steady growth
            </div>
            <div className="space-y-6">
              <h1 className="max-w-3xl text-5xl font-bold tracking-tight text-slate-950 sm:text-6xl">
                FarmVista for Punjab: clean residue, smarter fields, stronger incomes.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-700 sm:text-xl">
                A 3D-inspired agri intelligence demo that connects farmers, machinery providers and coordinators with precision
                residue insights, buyer matching, and real-time field decisions.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                href="/farmer"
                className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:bg-slate-800"
              >
                Get started
              </Link>
              <Link
                href="/coordinator/dashboard"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-slate-900 shadow-sm transition hover:-translate-y-1 hover:border-slate-300"
              >
                Coordinator view
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {impactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="glass-panel rounded-[2rem] p-5 shadow-card card-3d">
                    <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-950/5 text-emerald-500">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold text-slate-950">{card.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mx-auto max-w-3xl">
            <div className="glass-panel relative overflow-hidden rounded-[3rem] border border-white/70 p-6 shadow-card card-3d">
              <div className="absolute -right-20 top-16 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
              <div className="absolute left-8 top-12 h-24 w-24 rounded-full bg-sky-500/10 blur-3xl" />
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-slate-950/5 p-4 text-slate-900 ring-1 ring-white/50 backdrop-blur-xl">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">FarmVista</p>
                    <p className="mt-3 text-2xl font-semibold text-slate-950">Live field insights</p>
                  </div>
                  <span className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white">50K+ farms</span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Residue forecast</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">3.4 t / acre</p>
                  </div>
                  <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Buyer demand</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">High</p>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Precision alerts</p>
                    <p className="mt-4 text-lg font-semibold text-slate-950">Stubble risk rising in Patiala</p>
                  </div>
                  <div className="rounded-3xl bg-white/90 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Machinery readiness</p>
                    <p className="mt-4 text-3xl font-semibold text-slate-950">82%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

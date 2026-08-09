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
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-8 sm:px-6 lg:px-8">
      <section className="rounded-3xl bg-white p-6 shadow-card sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-center">
          <div>
            <span className="inline-flex rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Punjab pilot
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Parali-to-Prosper
            </h1>
            <p className="mt-4 max-w-xl text-lg leading-8 text-slate-700">
              Turn crop residue into income, cleaner air and smarter farming. A demo platform for Punjab farmers,
              machinery providers and coordinators.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Link
                href="/farmer"
                className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-base font-semibold text-white transition hover:bg-primary/90"
              >
                Enter as Farmer
              </Link>
              <Link
                href="/machinery"
                className="inline-flex items-center justify-center rounded-2xl bg-amber-500 px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-amber-400"
              >
                Provider
              </Link>
              <Link
                href="/coordinator/dashboard"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-50"
              >
                Coordinator
              </Link>
            </div>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-slate-900 shadow-sm">
            <div className="flex items-center gap-3 text-sm text-slate-600">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <span>Quick demo-ready farm intelligence for Punjab residue management.</span>
            </div>
            <div className="mt-8 grid gap-4">
              {impactCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </span>
                      <div>
                        <h2 className="font-semibold text-slate-900">{card.title}</h2>
                        <p className="mt-1 text-sm text-slate-600">{card.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-8 rounded-3xl border border-primary/20 bg-primary/5 p-5 text-slate-800">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">Use case</p>
              <p className="mt-3 text-base leading-7">
                Demonstrate sustainable stubble management, machinery booking, biomass buyer matching, crop
                diversification and water-smart choices for Punjab farmers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

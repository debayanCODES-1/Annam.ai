export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '../../../lib/db/prisma';

async function loadCoordinatorMetrics() {
  const totalFarms = await prisma.farm.count();
  const availableMachinery = await prisma.machinery.count({ where: { availabilityStatus: 'AVAILABLE' } });
  const openBuyers = await prisma.biomassBuyer.count({ where: { status: 'OPEN' } });
  const paddyFarms = await prisma.farm.count({ where: { currentCrop: 'Paddy' } });
  const highRiskFarms = await prisma.farm.count({ where: { currentCrop: 'Paddy', areaInAcres: { gte: 5 } } });
  const farmDistricts = await prisma.farm.findMany({
    select: {
      farmer: {
        select: {
          district: true,
        },
      },
    },
  });

  const districtCounts = farmDistricts.reduce<Record<string, number>>((counts, item) => {
    const district = item.farmer.district;
    counts[district] = (counts[district] ?? 0) + 1;
    return counts;
  }, {});

  const topDistricts = Object.entries(districtCounts)
    .map(([district, count]) => ({ district, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return { totalFarms, availableMachinery, openBuyers, paddyFarms, highRiskFarms, topDistricts };
}

export default async function CoordinatorDashboardPage() {
  const { totalFarms, availableMachinery, openBuyers, paddyFarms, highRiskFarms, topDistricts } = await loadCoordinatorMetrics();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="glass-panel rounded-[2.5rem] border border-white/80 p-8 shadow-card card-3d">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">District coordinator</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-950">Precision command center</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
                Monitor residue risk, machinery readiness, buyer interest and district-level alerts with more granular coordination.
              </p>
            </div>
            <Link
              href="/coordinator/help"
              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-base font-semibold text-slate-900 shadow-sm transition hover:bg-slate-50"
            >
              Coordinator help
            </Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Managed farms</p>
              <p className="mt-4 text-4xl font-semibold text-slate-950">{totalFarms}</p>
              <p className="mt-3 text-sm text-slate-600">Farms tracked across the Punjab pilot.</p>
            </div>
            <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Available machinery</p>
              <p className="mt-4 text-4xl font-semibold text-slate-950">{availableMachinery}</p>
              <p className="mt-3 text-sm text-slate-600">Machine units ready for booking.</p>
            </div>
            <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Active buyers</p>
              <p className="mt-4 text-4xl font-semibold text-slate-950">{openBuyers}</p>
              <p className="mt-3 text-sm text-slate-600">Open biomass and residue demand listings.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Precision alerts</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-950">{highRiskFarms} high-risk farms</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-700">Priority</span>
              </div>
              <p className="mt-4 text-sm text-slate-600">
                Farms with large paddy holdings and recent harvests that require immediate residue and machinery coordination.
              </p>
            </div>
            <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Paddy prevalence</p>
              <p className="mt-4 text-5xl font-semibold text-slate-950">{paddyFarms}</p>
              <p className="mt-3 text-sm text-slate-600">Paddy farms are a key precision focus for residue reduction.</p>
            </div>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {topDistricts.map((district) => (
              <div key={district.district} className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Top zone</p>
                <p className="mt-4 text-2xl font-semibold text-slate-950">{district.district}</p>
                <p className="mt-3 text-sm text-slate-600">{district.count} tracked farms in this district.</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

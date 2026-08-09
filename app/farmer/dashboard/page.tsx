export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { prisma } from '../../../lib/db/prisma';
import { t } from '../../../lib/i18n';
import { MockWeatherProvider } from '../../../lib/adapters/weather';
import { createRecommendation } from '../../../lib/services/recommendationService';
import CropComparisonCard from '../../../components/farmer/CropComparisonCard';
import BookMachineryCard from '../../../components/farmer/BookMachineryCard';
import FarmMap from '../../../components/farmer/FarmMap';
import StoredFarmerProfile from '../../../components/farmer/StoredFarmerProfile';
import HarvestTrendChart from '../../../components/farmer/HarvestTrendChart';

const weatherProvider = new MockWeatherProvider();

function formatDate(date: Date | string | null) {
  if (!date) return '—';
  const value = typeof date === 'string' ? new Date(date) : date;
  return value.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

async function getDashboardData() {
  const farm = await prisma.farm.findFirst({
    orderBy: { createdAt: 'desc' },
    include: {
      harvestRecords: {
        orderBy: { harvestDate: 'asc' },
      },
      farmer: true,
    },
  });

  const machinery = await prisma.machinery.findMany({
    where: { availabilityStatus: 'AVAILABLE' },
    orderBy: { pricePerAcre: 'asc' },
    take: 4,
  });

  const buyers = await prisma.biomassBuyer.findMany({
    where: { status: 'OPEN' },
    orderBy: { pricePerTonne: 'desc' },
    take: 3,
  });

  const weather = farm
    ? await weatherProvider.getCurrentWeather({ latitude: farm.latitude, longitude: farm.longitude })
    : null;

  const latestHarvest = farm?.harvestRecords.at(-1) ?? null;

  const recommendation = farm && latestHarvest && weather
    ? createRecommendation(
        {
          farmName: farm.farmName,
          areaInAcres: farm.areaInAcres,
          currentCrop: farm.currentCrop,
          cropStage: farm.cropStage,
          soilType: farm.soilType,
          irrigationType: farm.irrigationType,
        },
        {
          residueQuantity: latestHarvest.estimatedResidueTonnes,
          harvestDate: latestHarvest.harvestDate.toISOString(),
        },
        {
          distanceKm: 3.2,
          pricePerAcre: machinery[0]?.pricePerAcre ?? 2200,
          available: machinery.length > 0,
        },
        {
          distanceKm: 5.1,
          pricePerTonne: buyers[0]?.pricePerTonne ?? 2400,
          available: buyers.length > 0,
        },
        weather,
      )
    : null;

  const residuePerAcre = latestHarvest ? latestHarvest.estimatedResidueTonnes / farm!.areaInAcres : null;
  const buyerDemand = buyers.length >= 2 ? 'Strong' : buyers.length === 1 ? 'Moderate' : 'Weak';
  const waterIntensity = farm?.currentCrop === 'Paddy' ? 'High' : farm?.currentCrop === 'Maize' ? 'Moderate' : 'Balanced';
  const machineryScore = Math.min(100, 40 + machinery.length * 14);
  const harvestUrgencyLabel = recommendation?.harvestUrgencyLabel ?? 'Moderate';
  const marketOpportunity = recommendation?.marketOpportunity ?? 'Market signals are updating.';
  const offerPrice = recommendation?.offerPrice ? `₹${recommendation.offerPrice}/t` : 'No buyer offers yet';
  const collectionCost = recommendation?.collectionCost ? `₹${recommendation.collectionCost.toFixed(0)}` : 'Estimate pending';

  return {
    farm,
    harvestHistory: farm?.harvestRecords ?? [],
    latestHarvest,
    machinery,
    buyers,
    weather,
    recommendation,
    residuePerAcre,
    buyerDemand,
    waterIntensity,
    machineryScore,
    harvestUrgencyLabel,
    marketOpportunity,
    offerPrice,
    collectionCost,
  };
}

export default async function FarmerDashboardPage() {
  const translation = t('en');
  const {
    farm,
    harvestHistory,
    latestHarvest,
    machinery,
    buyers,
    weather,
    recommendation,
    residuePerAcre,
    buyerDemand,
    waterIntensity,
    machineryScore,
    harvestUrgencyLabel,
    marketOpportunity,
    offerPrice,
    collectionCost,
  } = await getDashboardData();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <section className="glass-panel rounded-[2.5rem] border border-white/80 p-8 shadow-card card-3d">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
            <div className="space-y-5 xl:max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-600">Farmer dashboard</p>
              <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">{translation.dashboard.greeting}</h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Drive residue value with field-ready crop guidance, buyer signals, and equipment availability for your next harvest window.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="glass-panel rounded-[2rem] p-5 shadow-card card-3d">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Field risk</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-950">{buyerDemand}</p>
                  <p className="mt-2 text-sm text-slate-600">Buyer demand and residue interest.</p>
                </div>
                <div className="glass-panel rounded-[2rem] p-5 shadow-card card-3d">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Weather pulse</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-950">{weather ? `${weather.temperatureC}°C` : '—'}</p>
                  <p className="mt-2 text-sm text-slate-600">{weather ? `${weather.condition}, rain ${weather.rainProbability}%` : 'Data syncing'}</p>
                </div>
                <div className="glass-panel rounded-[2rem] p-5 shadow-card card-3d">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Harvest urgency</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-950">{harvestUrgencyLabel}</p>
                  <p className="mt-2 text-sm text-slate-600">How soon you should act on residue removal.</p>
                </div>
                <div className="glass-panel rounded-[2rem] p-5 shadow-card card-3d">
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Market opportunity</p>
                  <p className="mt-4 text-3xl font-semibold text-slate-950">{marketOpportunity}</p>
                  <p className="mt-2 text-sm text-slate-600">Best next step for residue value.</p>
                </div>
              </div>
            </div>
            <div className="rounded-[2rem] border border-white/60 bg-white/90 p-6 shadow-card card-3d">
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Machinery readiness</p>
              <p className="mt-4 text-5xl font-semibold text-slate-950">{machineryScore}%</p>
              <p className="mt-3 text-sm text-slate-600">Available equipment in your region and nearby service windows.</p>
            </div>
          </div>
        </section>

        {!farm ? (
          <div className="rounded-[2.5rem] border border-amber-200 bg-amber-50 p-8 text-slate-900 shadow-card card-3d">
            <p className="text-base font-semibold">No farm profile found.</p>
            <p className="mt-2 text-sm text-slate-700">Complete the farmer onboarding form to access your personalized dashboard.</p>
            <Link href="/farmer/onboarding" className="mt-4 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
              Start onboarding
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
              <div className="glass-panel rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-card card-3d">
                <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div className="space-y-4">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Farm summary</p>
                    <h2 className="text-2xl font-semibold text-slate-950">{farm.farmName}</h2>
                    <div className="grid gap-3 sm:grid-cols-2 text-sm text-slate-600">
                      <div><strong className="text-slate-900">Location:</strong> {farm.latitude.toFixed(3)}, {farm.longitude.toFixed(3)}</div>
                      <div><strong className="text-slate-900">Area:</strong> {farm.areaInAcres} acres</div>
                      <div><strong className="text-slate-900">Crop:</strong> {farm.currentCrop}</div>
                      <div><strong className="text-slate-900">Stage:</strong> {farm.cropStage}</div>
                      <div><strong className="text-slate-900">Soil:</strong> {farm.soilType}</div>
                      <div><strong className="text-slate-900">Irrigation:</strong> {farm.irrigationType}</div>
                    </div>
                  </div>
                  <div className="rounded-[2rem] bg-slate-950/5 p-5 shadow-sm">
                    <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Residue intensity</p>
                    <p className="mt-4 text-4xl font-semibold text-slate-950">{residuePerAcre ? `${residuePerAcre.toFixed(1)} t/ac` : '—'}</p>
                    <p className="mt-3 text-sm text-slate-600">Estimated residue output per acre.</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2.5rem] bg-slate-950/5 p-4 shadow-card card-3d">
                <FarmMap
                  farmLocation={{ latitude: farm.latitude, longitude: farm.longitude }}
                  machinery={machinery}
                  buyers={buyers.map((buyer) => ({
                    id: buyer.id,
                    name: buyer.name,
                    buyerType: buyer.buyerType,
                    village: buyer.village,
                    district: buyer.district,
                    latitude: buyer.latitude,
                    longitude: buyer.longitude,
                    pricePerTonne: buyer.pricePerTonne,
                  }))}
                />
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Harvest trend</p>
                <div className="mt-5 h-72">
                  <HarvestTrendChart history={harvestHistory} />
                </div>
              </div>
              <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Top machinery</p>
                <div className="mt-4 space-y-3">
                  {machinery.slice(0, 3).map((machine) => (
                    <div key={machine.id} className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="font-semibold text-slate-900">{machine.name}</p>
                      <p className="text-sm text-slate-500">{machine.type} • ₹{machine.pricePerAcre}/acre</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="glass-panel rounded-[2rem] p-6 shadow-card card-3d">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Open buyers</p>
                <div className="mt-4 space-y-3">
                  {buyers.slice(0, 3).map((buyer) => (
                    <div key={buyer.id} className="rounded-3xl bg-white p-4 shadow-sm">
                      <p className="font-semibold text-slate-900">{buyer.name}</p>
                      <p className="text-sm text-slate-500">{buyer.buyerType} • ₹{buyer.pricePerTonne}/t</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {recommendation && (
              <div className="rounded-[2.5rem] border border-primary/20 bg-primary/5 p-6 shadow-card card-3d">
                <p className="text-sm uppercase tracking-[0.24em] text-primary">Recommendation</p>
                <h2 className="mt-3 text-2xl font-semibold text-slate-950">{recommendation.title}</h2>
                <p className="mt-3 text-sm text-slate-700">{recommendation.explanation}</p>
                <div className="mt-4 grid gap-3 lg:grid-cols-3">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Confidence</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{Math.round(recommendation.confidence * 100)}%</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Income impact</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">₹{recommendation.estimatedIncomeChange}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Buyer offer</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{offerPrice}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Collection cost</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{collectionCost}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Action label</p>
                    <p className="mt-1 text-xl font-semibold text-slate-900">{recommendation.actionLabel}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-slate-700">
                  {recommendation.reasons.map((reason) => (
                    <p key={reason}>• {reason}</p>
                  ))}
                  {recommendation.warnings.map((warning) => (
                    <p key={warning} className="text-amber-900">⚠️ {warning}</p>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-[2.5rem] border border-white/70 bg-white/90 p-6 shadow-card card-3d">
                <CropComparisonCard
                  district={farm.farmer.district}
                  soilType={farm.soilType}
                  irrigationType={farm.irrigationType}
                  farmArea={farm.areaInAcres}
                  currentCrop={farm.currentCrop}
                />
              </div>
              <div className="space-y-4">
                <div className="rounded-[2.5rem] bg-slate-950/5 p-6 shadow-card card-3d">
                  <StoredFarmerProfile />
                </div>
                <div className="rounded-[2.5rem] bg-slate-950/5 p-6 shadow-card card-3d">
                  <BookMachineryCard farmId={farm.id} farmerId={farm.farmer.id} machinery={machinery} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/farmer/onboarding" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
            Back to onboarding
          </Link>
          <Link href="/farmer/help" className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
            Farmer help
          </Link>
        </div>
      </div>
    </main>
  );
}

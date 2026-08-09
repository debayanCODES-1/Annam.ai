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

  return { farm, harvestHistory: farm?.harvestRecords ?? [], latestHarvest, machinery, buyers, weather, recommendation };
}

export default async function FarmerDashboardPage() {
  const translation = t('en');
  const { farm, harvestHistory, latestHarvest, machinery, buyers, weather, recommendation } = await getDashboardData();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">Farmer dashboard</p>
              <h1 className="mt-3 text-3xl font-semibold text-slate-900">{translation.dashboard.greeting}</h1>
            </div>
            <div className="flex flex-col gap-2 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <span className="font-medium text-slate-900">Current weather</span>
              <span>{weather ? `${weather.condition}, ${weather.temperatureC}°C` : 'Loading weather'}</span>
              <span>{weather ? `Rain chance ${weather.rainProbability}%` : ''}</span>
            </div>
          </div>

          {!farm ? (
            <div className="mt-8 rounded-3xl border border-amber-200 bg-amber-50 p-6 text-slate-900">
              <p className="text-base font-semibold">No farm profile found.</p>
              <p className="mt-2 text-sm text-slate-700">Complete the farmer onboarding form to view your farm dashboard.</p>
              <Link href="/farmer/onboarding" className="mt-4 inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
                Start onboarding
              </Link>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Farm summary</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{farm.farmName}</h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-slate-500">Location</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{farm.latitude.toFixed(3)}, {farm.longitude.toFixed(3)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Area</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{farm.areaInAcres} acres</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Crop status</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{farm.currentCrop} — {farm.cropStage}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Irrigation</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">{farm.irrigationType}, {farm.soilType}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Harvest trend</p>
                  <div className="mt-5 h-72">
                    <HarvestTrendChart history={harvestHistory} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.4fr_0.6fr]">
                <div className="h-[380px]">
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
                <div className="space-y-4">
                  <BookMachineryCard farmId={farm.id} farmerId={farm.farmer.id} machinery={machinery} />
                  <StoredFarmerProfile />
                </div>
              </div>

              {recommendation && (
                <div className="rounded-3xl border border-primary/20 bg-primary/5 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-primary">Recommendation</p>
                  <h2 className="mt-3 text-2xl font-semibold text-slate-900">{recommendation.title}</h2>
                  <p className="mt-3 text-sm text-slate-700">{recommendation.explanation}</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">Confidence</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">{Math.round(recommendation.confidence * 100)}%</p>
                    </div>
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-slate-500">Income impact</p>
                      <p className="mt-1 text-xl font-semibold text-slate-900">₹{recommendation.estimatedIncomeChange}</p>
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

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{translation.dashboard.findMachinery}</p>
                  <div className="mt-4 space-y-3">
                    {machinery.length === 0 ? (
                      <p className="text-sm text-slate-600">No machinery currently available.</p>
                    ) : (
                      machinery.map((machine) => (
                        <div key={machine.id} className="rounded-2xl bg-white p-3 shadow-sm">
                          <p className="font-semibold text-slate-900">{machine.name}</p>
                          <p className="text-sm text-slate-500">{machine.type} • ₹{machine.pricePerAcre}/acre</p>
                          <p className="text-sm text-slate-500">{machine.village}, {machine.district}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{translation.dashboard.findBuyer}</p>
                  <div className="mt-4 space-y-3">
                    {buyers.length === 0 ? (
                      <p className="text-sm text-slate-600">No buyers currently open.</p>
                    ) : (
                      buyers.map((buyer) => (
                        <div key={buyer.id} className="rounded-2xl bg-white p-3 shadow-sm">
                          <p className="font-semibold text-slate-900">{buyer.name}</p>
                          <p className="text-sm text-slate-500">{buyer.buyerType} • ₹{buyer.pricePerTonne}/tonne</p>
                          <p className="text-sm text-slate-500">{buyer.village}, {buyer.district}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">{translation.dashboard.compareCrops}</p>
                  <CropComparisonCard
                    district={farm.farmer.district}
                    soilType={farm.soilType}
                    irrigationType={farm.irrigationType}
                    farmArea={farm.areaInAcres}
                    currentCrop={farm.currentCrop}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link href="/farmer/onboarding" className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">
              Back to onboarding
            </Link>
            <Link href="/farmer/help" className="inline-flex items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90">
              Farmer help
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

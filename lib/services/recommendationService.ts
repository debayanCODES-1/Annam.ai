import { WeatherCondition } from '../adapters/weather';
import { CropRecommendationResult, recommendCrop } from '../calculations/cropRecommendation';
import { calculateResidueRecommendation, ResidueRecommendationInput, ResidueRecommendationResult } from '../calculations/residueRecommendation';

export type RecommendationOutput = {
  recommendationType: string;
  title: string;
  explanation: string;
  confidence: number;
  estimatedWaterSaving: number;
  estimatedIncomeChange: number;
  reasons: string[];
  warnings: string[];
  actionLabel: string;
  dataFreshness: string;
  offerPrice?: number;
  collectionCost?: number;
  harvestUrgencyLabel?: string;
  marketOpportunity?: string;
};

export function createRecommendation(
  farmProfile: { farmName: string; areaInAcres: number; currentCrop: string; cropStage: string; soilType: string; irrigationType: string },
  harvestRecord: { residueQuantity: number; harvestDate: string },
  machineryData: { distanceKm: number; pricePerAcre: number; available: boolean },
  buyerData: { distanceKm: number; pricePerTonne: number; available: boolean },
  weather: WeatherCondition,
): RecommendationOutput {
  const harvestUrgency = Math.max(
    1,
    Math.min(10, Math.round((Date.now() - new Date(harvestRecord.harvestDate).getTime()) / (1000 * 60 * 60 * 24))),
  );

  const input: ResidueRecommendationInput = {
    residueQuantity: harvestRecord.residueQuantity,
    farmArea: farmProfile.areaInAcres,
    machineryDistance: machineryData.distanceKm,
    machineryPrice: machineryData.pricePerAcre,
    buyerDistance: buyerData.distanceKm,
    buyerPrice: buyerData.pricePerTonne,
    pickupAvailability: buyerData.available ? 1 : 0,
    farmerHasMachinery: false,
    harvestUrgency,
    internetAvailable: true,
  };

  const residueResult: ResidueRecommendationResult = calculateResidueRecommendation(input);
  const cropResult: CropRecommendationResult = recommendCrop({
    district: 'Patiala',
    soilType: farmProfile.soilType,
    irrigationType: farmProfile.irrigationType,
    farmArea: farmProfile.areaInAcres,
    currentCrop: farmProfile.currentCrop,
    farmerPriority: 'Save water',
  });

  const tradeRevenue = buyerData.available ? harvestRecord.residueQuantity * buyerData.pricePerTonne : 0;
  const bookingCost = machineryData.available ? farmProfile.areaInAcres * machineryData.pricePerAcre : 0;
  const action = residueResult.recommendation === 'BOOK_MACHINERY' ? 'Book nearby machinery' : residueResult.recommendation === 'SELL_RESIDUE' ? 'List residue for sale' : 'Keep residue in field';
  const harvestUrgencyLabel = harvestUrgency >= 8 ? 'High' : harvestUrgency >= 5 ? 'Medium' : 'Low';
  const marketOpportunity = buyerData.available
    ? `Sell residue to a buyer at ₹${buyerData.pricePerTonne}/tonne` 
    : `Hold residue and wait for a stronger market signal`;

  const warnings = [];
  if (weather.rainProbability > 40) warnings.push('Rain is likely soon, delay field operations if possible.');
  if (harvestUrgency >= 8) warnings.push('Harvest is aging; prioritize residue collection this week.');

  return {
    recommendationType: 'MACHINERY_BOOKING',
    title: action,
    explanation: `A recommendation based on residue quantity, nearby machine availability, buyer pricing, and weather conditions.`,
    confidence: Math.min(0.95, residueResult.scores.total),
    estimatedWaterSaving: cropResult.crop === farmProfile.currentCrop ? 120 : 95,
    estimatedIncomeChange: tradeRevenue > 0 ? Math.round(tradeRevenue * 0.8) : 0,
    reasons: [
      `Estimated residue quantity: ${harvestRecord.residueQuantity.toFixed(1)} tonnes`,
      `Nearby machinery price: ₹${machineryData.pricePerAcre}/acre`,
      `Buyer price: ₹${buyerData.pricePerTonne}/tonne`,
      `Weather: ${weather.condition}`,
    ],
    warnings,
    actionLabel: action,
    dataFreshness: 'Updated just now',
    offerPrice: buyerData.available ? buyerData.pricePerTonne : undefined,
    collectionCost: machineryData.available ? bookingCost : undefined,
    harvestUrgencyLabel,
    marketOpportunity,
  };
}

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
};

export function createRecommendation(
  farmProfile: { farmName: string; areaInAcres: number; currentCrop: string; cropStage: string; soilType: string; irrigationType: string },
  harvestRecord: { residueQuantity: number; harvestDate: string },
  machineryData: { distanceKm: number; pricePerAcre: number; available: boolean },
  buyerData: { distanceKm: number; pricePerTonne: number; available: boolean },
  weather: WeatherCondition,
): RecommendationOutput {
  const input: ResidueRecommendationInput = {
    residueQuantity: harvestRecord.residueQuantity,
    farmArea: farmProfile.areaInAcres,
    machineryDistance: machineryData.distanceKm,
    machineryPrice: machineryData.pricePerAcre,
    buyerDistance: buyerData.distanceKm,
    buyerPrice: buyerData.pricePerTonne,
    pickupAvailability: buyerData.available ? 1 : 0,
    farmerHasMachinery: false,
    harvestUrgency: Math.max(1, Math.min(10, Math.round((Date.now() - new Date(harvestRecord.harvestDate).getTime()) / (1000 * 60 * 60 * 24)))),
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

  const bestAction = residueResult.recommendation === 'BOOK_MACHINERY' ? 'Book nearby machinery' : residueResult.recommendation === 'SELL_RESIDUE' ? 'List residue for sale' : 'Keep residue in field';

  const warnings = [];
  if (weather.rainProbability > 40) warnings.push('Rain is likely soon, delay operations if possible');

  return {
    recommendationType: 'MACHINERY_BOOKING',
    title: bestAction,
    explanation: `A recommendation based on residue quantity, local machinery and buyer prices, and weather conditions.`,
    confidence: Math.min(0.95, residueResult.scores.total),
    estimatedWaterSaving: 120,
    estimatedIncomeChange: residueResult.recommendation === 'SELL_RESIDUE' ? 1200 : 0,
    reasons: [
      `Estimated residue quantity: ${harvestRecord.residueQuantity.toFixed(1)} tonnes`,
      `Nearby machinery at ${machineryData.distanceKm} km`,
      `Buyer price: ₹${buyerData.pricePerTonne}/tonne`,
      `Weather: ${weather.condition}`,
    ],
    warnings,
    actionLabel: bestAction,
    dataFreshness: 'Updated just now',
  };
}

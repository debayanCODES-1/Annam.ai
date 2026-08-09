export type ResidueRecommendationInput = {
  residueQuantity: number;
  farmArea: number;
  machineryDistance: number;
  machineryPrice: number;
  buyerDistance: number;
  buyerPrice: number;
  pickupAvailability: number;
  farmerHasMachinery: boolean;
  harvestUrgency: number;
  internetAvailable: boolean;
};

export type ResidueRecommendationResult = {
  scores: {
    affordability: number;
    convenience: number;
    income: number;
    environmental: number;
    time: number;
    total: number;
  };
  recommendation: 'KEEP_IN_FIELD' | 'BOOK_MACHINERY' | 'SELL_RESIDUE' | 'CONVERT_TO_COMPOST';
  breakdown: string[];
};

const defaultWeights = {
  affordability: 0.25,
  convenience: 0.2,
  income: 0.2,
  environmental: 0.2,
  time: 0.15,
};

function normalize(value: number, min: number, max: number) {
  if (max <= min) return 0.5;
  return Math.min(1, Math.max(0, (value - min) / (max - min)));
}

export function calculateResidueRecommendation(
  input: ResidueRecommendationInput,
  weights = defaultWeights,
): ResidueRecommendationResult {
  const affordability = input.farmerHasMachinery
    ? 1
    : 1 - normalize(input.machineryPrice, 1200, 3000);
  const convenience = 1 - normalize(input.machineryDistance, 0, 40);
  const income = normalize(input.buyerPrice, 1800, 3200);
  const environmental = normalize(100 - input.harvestUrgency * 10, 0, 100);
  const time = input.harvestUrgency > 6 ? 0.4 : 1 - normalize(input.harvestUrgency, 0, 14);

  const total =
    affordability * weights.affordability +
    convenience * weights.convenience +
    income * weights.income +
    environmental * weights.environmental +
    time * weights.time;

  const recommendation = input.farmerHasMachinery
    ? 'BOOK_MACHINERY'
    : input.buyerPrice > 2200
    ? 'SELL_RESIDUE'
    : 'KEEP_IN_FIELD';

  const breakdown = [
    `Affordability: ${(affordability * 100).toFixed(0)}%`,
    `Convenience: ${(convenience * 100).toFixed(0)}%`,
    `Income: ${(income * 100).toFixed(0)}%`,
    `Environmental: ${(environmental * 100).toFixed(0)}%`,
    `Time: ${(time * 100).toFixed(0)}%`,
  ];

  return { scores: { affordability, convenience, income, environmental, time, total }, recommendation, breakdown };
}

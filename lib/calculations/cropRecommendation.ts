export type CropRecommendationInput = {
  district: string;
  soilType: string;
  irrigationType: string;
  farmArea: number;
  currentCrop: string;
  farmerPriority: 'Save water' | 'Maximize income' | 'Reduce risk' | 'Short crop duration' | 'Reduce residue';
};

export type CropRecommendationResult = {
  crop: string;
  reason: string;
  uncertainty: string;
  waterScore: number;
  incomeScore: number;
  riskScore: number;
  residueScore: number;
};

const cropProfiles = [
  {
    name: 'Paddy',
    water: 1200,
    income: 55,
    risk: 8,
    residue: 9,
    duration: 150,
  },
  {
    name: 'Maize',
    water: 700,
    income: 39,
    risk: 6,
    residue: 7,
    duration: 120,
  },
  {
    name: 'Cotton',
    water: 850,
    income: 45,
    risk: 6,
    residue: 8,
    duration: 140,
  },
  {
    name: 'Pulses',
    water: 450,
    income: 26,
    risk: 4,
    residue: 3,
    duration: 90,
  },
  {
    name: 'Mustard',
    water: 500,
    income: 23,
    risk: 4,
    residue: 4,
    duration: 110,
  },
  {
    name: 'Vegetables',
    water: 600,
    income: 48,
    risk: 8,
    residue: 5,
    duration: 80,
  },
];

export function recommendCrop(input: CropRecommendationInput): CropRecommendationResult {
  const normalized = cropProfiles.map((crop) => {
    const waterScore = 1 - crop.water / 1400;
    const incomeScore = crop.income / 60;
    const riskScore = 1 - crop.risk / 10;
    const residueScore = 1 - crop.residue / 10;
    let score = 0;

    if (input.farmerPriority === 'Save water') score = waterScore * 0.5 + residueScore * 0.2 + riskScore * 0.3;
    if (input.farmerPriority === 'Maximize income') score = incomeScore * 0.6 + waterScore * 0.2 + residueScore * 0.2;
    if (input.farmerPriority === 'Reduce risk') score = riskScore * 0.5 + waterScore * 0.25 + incomeScore * 0.25;
    if (input.farmerPriority === 'Short crop duration') score = (1 - crop.duration / 160) * 0.5 + waterScore * 0.25 + riskScore * 0.25;
    if (input.farmerPriority === 'Reduce residue') score = residueScore * 0.5 + waterScore * 0.25 + riskScore * 0.25;

    return {
      crop: crop.name,
      waterScore,
      incomeScore,
      riskScore,
      residueScore,
      score,
    };
  });

  const recommendation = normalized.reduce((best, current) => (current.score > best.score ? current : best), normalized[0]);
  return {
    crop: recommendation.crop,
    reason: `This recommendation is based on ${input.farmerPriority.toLowerCase()} and local farm conditions.`,
    uncertainty: 'This is a prototype estimate and should be verified locally.',
    waterScore: recommendation.waterScore,
    incomeScore: recommendation.incomeScore,
    riskScore: recommendation.riskScore,
    residueScore: recommendation.residueScore,
  };
}

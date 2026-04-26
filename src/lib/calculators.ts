export type RentEstimateInput = {
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  propertyType: string;
  condition: string;
};

const propertyRates: Record<string, number> = {
  apartment: 1.55,
  house: 1.38,
  duplex: 1.32,
  townhouse: 1.45,
  condo: 1.62
};

const conditionMultipliers: Record<string, number> = {
  basic: 0.92,
  average: 1,
  premium: 1.15
};

export function calculateRentEstimate(input: RentEstimateInput) {
  const rate = propertyRates[input.propertyType] ?? propertyRates.apartment;
  const condition = conditionMultipliers[input.condition] ?? 1;
  const bedroomAdjustment = Math.max(0, input.bedrooms - 1) * 125;
  const bathroomAdjustment = Math.max(0, input.bathrooms - 1) * 85;
  const midpoint = input.squareFeet * rate * condition + bedroomAdjustment + bathroomAdjustment;

  return {
    low: midpoint * 0.9,
    midpoint,
    high: midpoint * 1.1,
    pricePerSqFt: midpoint / input.squareFeet
  };
}

export type RentComparisonProperty = {
  rent: number;
  squareFeet: number;
  bedrooms: number;
  bathrooms: number;
};

export function calculateRentComparison(properties: RentComparisonProperty[]) {
  const rows = properties.map((property, index) => ({
    ...property,
    index,
    pricePerSqFt: property.rent / property.squareFeet
  }));
  const averageRent = rows.reduce((sum, row) => sum + row.rent, 0) / rows.length;
  const cheapest = rows.reduce((best, row) => (row.rent < best.rent ? row : best), rows[0]);
  const mostExpensive = rows.reduce((best, row) => (row.rent > best.rent ? row : best), rows[0]);

  return { rows, averageRent, cheapestIndex: cheapest.index, mostExpensiveIndex: mostExpensive.index };
}

export function calculateMarketRentAnalysis(userRent: number, marketRent: number, squareFeet: number) {
  const difference = userRent - marketRent;
  const percentDifference = (difference / marketRent) * 100;

  return {
    difference,
    percentDifference,
    userPricePerSqFt: userRent / squareFeet,
    marketPricePerSqFt: marketRent / squareFeet
  };
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function roundPercent(value: number) {
  return Math.round(value * 100) / 100;
}

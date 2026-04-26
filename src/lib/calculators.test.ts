import { describe, expect, it } from "vitest";
import {
  calculateMarketRentAnalysis,
  calculateRentComparison,
  calculateRentEstimate,
  roundMoney,
  roundPercent
} from "./calculators";

describe("rent estimate", () => {
  it("returns a range and price per square foot", () => {
    const result = calculateRentEstimate({
      bedrooms: 2,
      bathrooms: 2,
      squareFeet: 1000,
      propertyType: "apartment",
      condition: "average"
    });

    expect(roundMoney(result.midpoint)).toBe(1760);
    expect(roundMoney(result.low)).toBe(1584);
    expect(roundMoney(result.high)).toBe(1936);
    expect(roundMoney(result.pricePerSqFt)).toBe(1.76);
  });
});

describe("rent comparison", () => {
  it("calculates average rent and identifies cheapest and most expensive", () => {
    const result = calculateRentComparison([
      { rent: 1200, squareFeet: 800, bedrooms: 1, bathrooms: 1 },
      { rent: 1600, squareFeet: 1000, bedrooms: 2, bathrooms: 1.5 },
      { rent: 1400, squareFeet: 900, bedrooms: 2, bathrooms: 1 }
    ]);

    expect(result.averageRent).toBe(1400);
    expect(result.cheapestIndex).toBe(0);
    expect(result.mostExpensiveIndex).toBe(1);
    expect(roundMoney(result.rows[0].pricePerSqFt)).toBe(1.5);
  });
});

describe("market rent analysis", () => {
  it("calculates above-market difference", () => {
    const result = calculateMarketRentAnalysis(1800, 1600, 1000);

    expect(result.difference).toBe(200);
    expect(roundPercent(result.percentDifference)).toBe(12.5);
    expect(roundMoney(result.userPricePerSqFt)).toBe(1.8);
    expect(roundMoney(result.marketPricePerSqFt)).toBe(1.6);
  });
});

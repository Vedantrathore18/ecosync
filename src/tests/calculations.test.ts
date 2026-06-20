import { describe, it, expect } from 'vitest';
import { calculateCarbonFootprint, CarbonInputs, defaultInputs } from '../utils/calculations';

describe('Carbon Footprint Calculation Suite', () => {
  it('should calculate non-zero carbon footprint for default inputs', () => {
    const results = calculateCarbonFootprint(defaultInputs);
    
    expect(results.travel).toBeGreaterThan(0);
    expect(results.home).toBeGreaterThan(0);
    expect(results.diet).toBeGreaterThan(0);
    expect(results.waste).toBeGreaterThan(0);
    expect(results.total).toEqual(results.travel + results.home + results.diet + results.waste);
  });

  it('should reflect different emission factors for petrol vs electric car', () => {
    const petrolInputs: CarbonInputs = {
      ...defaultInputs,
      carKm: 10000,
      carFuelType: 'petrol'
    };

    const electricInputs: CarbonInputs = {
      ...defaultInputs,
      carKm: 10000,
      carFuelType: 'electric'
    };

    const petrolResults = calculateCarbonFootprint(petrolInputs);
    const electricResults = calculateCarbonFootprint(electricInputs);

    // Car emission factor: Petrol is 0.17 kg/km, Electric is 0.05 kg/km
    // Difference should reflect in travel emissions
    expect(petrolResults.travel).toBeGreaterThan(electricResults.travel);
  });

  it('should show 0 travel emissions when no car is used and flight hours are 0', () => {
    const noTravelInputs: CarbonInputs = {
      ...defaultInputs,
      carKm: 0,
      carFuelType: 'none',
      flightsShort: 0,
      flightsLong: 0,
      transitHours: 0
    };

    const results = calculateCarbonFootprint(noTravelInputs);
    expect(results.travel).toBe(0);
  });

  it('should show zero home electricity emissions at 100% green energy', () => {
    const standardInputs: CarbonInputs = {
      ...defaultInputs,
      electricityKwh: 300,
      greenEnergyPercent: 0,
      heatingFuel: 'none',
      heatingKwh: 0
    };

    const greenInputs: CarbonInputs = {
      ...defaultInputs,
      electricityKwh: 300,
      greenEnergyPercent: 100,
      heatingFuel: 'none',
      heatingKwh: 0
    };

    const standardResults = calculateCarbonFootprint(standardInputs);
    const greenResults = calculateCarbonFootprint(greenInputs);

    expect(standardResults.home).toBeGreaterThan(0);
    expect(greenResults.home).toBe(0);
  });

  it('should scale diet emissions correctly based on diet type', () => {
    const meatInputs: CarbonInputs = {
      ...defaultInputs,
      dietType: 'heavy-meat',
      localFoodPercent: 0
    };

    const veganInputs: CarbonInputs = {
      ...defaultInputs,
      dietType: 'vegan',
      localFoodPercent: 0
    };

    const meatResults = calculateCarbonFootprint(meatInputs);
    const veganResults = calculateCarbonFootprint(veganInputs);

    expect(meatResults.diet).toBe(2500); // 2500 kg CO2e
    expect(veganResults.diet).toBe(500);  // 500 kg CO2e
  });

  it('should reduce waste footprint when recycling rate increases', () => {
    const lowRecyclingInputs: CarbonInputs = {
      ...defaultInputs,
      wasteVolume: 'average',
      shoppingHabits: 'average-consumer',
      recyclingRate: 0
    };

    const highRecyclingInputs: CarbonInputs = {
      ...defaultInputs,
      wasteVolume: 'average',
      shoppingHabits: 'average-consumer',
      recyclingRate: 100
    };

    const lowRecResults = calculateCarbonFootprint(lowRecyclingInputs);
    const highRecResults = calculateCarbonFootprint(highRecyclingInputs);

    // Recycling rate reduces waste emissions component by up to 40%
    expect(lowRecResults.waste).toBeGreaterThan(highRecResults.waste);
  });
});

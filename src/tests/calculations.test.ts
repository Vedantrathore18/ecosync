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

  it('should calculate vehicle emissions precisely for all fuel types', () => {
    const km = 10000;
    const baseInputs = {
      ...defaultInputs,
      carKm: km,
      flightsShort: 0,
      flightsLong: 0,
      transitHours: 0
    };

    const petrolVal = calculateCarbonFootprint({ ...baseInputs, carFuelType: 'petrol' }).travel;
    const dieselVal = calculateCarbonFootprint({ ...baseInputs, carFuelType: 'diesel' }).travel;
    const hybridVal = calculateCarbonFootprint({ ...baseInputs, carFuelType: 'hybrid' }).travel;
    const electricVal = calculateCarbonFootprint({ ...baseInputs, carFuelType: 'electric' }).travel;
    const noneVal = calculateCarbonFootprint({ ...baseInputs, carFuelType: 'none' }).travel;

    expect(petrolVal).toBe(Math.round(km * 0.17));
    expect(dieselVal).toBe(Math.round(km * 0.16));
    expect(hybridVal).toBe(Math.round(km * 0.10));
    expect(electricVal).toBe(Math.round(km * 0.05));
    expect(noneVal).toBe(0);
  });

  it('should calculate public transit emissions correctly', () => {
    const inputs: CarbonInputs = {
      ...defaultInputs,
      carKm: 0,
      carFuelType: 'none',
      flightsShort: 0,
      flightsLong: 0,
      transitHours: 10
    };
    const results = calculateCarbonFootprint(inputs);
    // 10 hours * 52 weeks * 1.2 kg = 624 kg CO2e
    expect(results.travel).toBe(624);
  });

  it('should calculate flights emissions correctly', () => {
    const inputs: CarbonInputs = {
      ...defaultInputs,
      carKm: 0,
      carFuelType: 'none',
      flightsShort: 5, // 5 * 150 = 750
      flightsLong: 2,  // 2 * 110 = 220
      transitHours: 0
    };
    const results = calculateCarbonFootprint(inputs);
    expect(results.travel).toBe(750 + 220);
  });

  it('should calculate electricity emissions based on green tariff percentage', () => {
    const baseInputs: CarbonInputs = {
      ...defaultInputs,
      electricityKwh: 500, // 500 * 12 * 0.38 = 2280 kg CO2e base
      heatingFuel: 'none',
      heatingKwh: 0
    };

    const results0 = calculateCarbonFootprint({ ...baseInputs, greenEnergyPercent: 0 });
    const results50 = calculateCarbonFootprint({ ...baseInputs, greenEnergyPercent: 50 });
    const results100 = calculateCarbonFootprint({ ...baseInputs, greenEnergyPercent: 100 });

    expect(results0.home).toBe(2280);
    expect(results50.home).toBe(1140);
    expect(results100.home).toBe(0);
  });

  it('should calculate heating emissions for all heating fuels correctly', () => {
    const kwh = 1000;
    const baseInputs: CarbonInputs = {
      ...defaultInputs,
      electricityKwh: 0,
      greenEnergyPercent: 100,
      heatingKwh: kwh
    };

    const gasVal = calculateCarbonFootprint({ ...baseInputs, heatingFuel: 'natural-gas' }).home;
    const lpgVal = calculateCarbonFootprint({ ...baseInputs, heatingFuel: 'lpg' }).home;
    const oilVal = calculateCarbonFootprint({ ...baseInputs, heatingFuel: 'heating-oil' }).home;
    const woodVal = calculateCarbonFootprint({ ...baseInputs, heatingFuel: 'wood' }).home;
    const noneVal = calculateCarbonFootprint({ ...baseInputs, heatingFuel: 'none' }).home;

    expect(gasVal).toBe(Math.round(kwh * 12 * 0.18));
    expect(lpgVal).toBe(Math.round(kwh * 12 * 0.24));
    expect(oilVal).toBe(Math.round(kwh * 12 * 0.27));
    expect(woodVal).toBe(Math.round(kwh * 12 * 0.03));
    expect(noneVal).toBe(0);
  });

  it('should calculate diet emissions for all diets and local sourcing options', () => {
    const baseInputs: CarbonInputs = {
      ...defaultInputs,
      localFoodPercent: 0
    };

    const heavyMeat = calculateCarbonFootprint({ ...baseInputs, dietType: 'heavy-meat' }).diet;
    const averageMeat = calculateCarbonFootprint({ ...baseInputs, dietType: 'average-meat' }).diet;
    const lowMeat = calculateCarbonFootprint({ ...baseInputs, dietType: 'low-meat' }).diet;
    const vegetarian = calculateCarbonFootprint({ ...baseInputs, dietType: 'vegetarian' }).diet;
    const vegan = calculateCarbonFootprint({ ...baseInputs, dietType: 'vegan' }).diet;

    expect(heavyMeat).toBe(2500);
    expect(averageMeat).toBe(1700);
    expect(lowMeat).toBe(1200);
    expect(vegetarian).toBe(900);
    expect(vegan).toBe(500);

    // Test local food offset (up to 10% reduction at 100% local sourcing)
    const localMeat100 = calculateCarbonFootprint({
      ...baseInputs,
      dietType: 'heavy-meat',
      localFoodPercent: 100
    }).diet;
    expect(localMeat100).toBe(Math.round(2500 * 0.9));

    const localMeat50 = calculateCarbonFootprint({
      ...baseInputs,
      dietType: 'heavy-meat',
      localFoodPercent: 50
    }).diet;
    expect(localMeat50).toBe(Math.round(2500 * 0.95));
  });

  it('should calculate waste volume and shopping habit emissions with recycling offsets', () => {
    const baseInputs: CarbonInputs = {
      ...defaultInputs,
      recyclingRate: 0,
      shoppingHabits: 'minimalist' // 150 kg CO2e
    };

    const highWaste = calculateCarbonFootprint({ ...baseInputs, wasteVolume: 'high' }).waste;
    const avgWaste = calculateCarbonFootprint({ ...baseInputs, wasteVolume: 'average' }).waste;
    const lowWaste = calculateCarbonFootprint({ ...baseInputs, wasteVolume: 'low' }).waste;

    expect(highWaste).toBe(800 + 150);
    expect(avgWaste).toBe(500 + 150);
    expect(lowWaste).toBe(250 + 150);

    // Test shopping habits emissions
    const heavyConsumer = calculateCarbonFootprint({
      ...baseInputs,
      wasteVolume: 'low',
      shoppingHabits: 'heavy-consumer'
    }).waste;
    const avgConsumer = calculateCarbonFootprint({
      ...baseInputs,
      wasteVolume: 'low',
      shoppingHabits: 'average-consumer'
    }).waste;

    expect(heavyConsumer).toBe(250 + 1200);
    expect(avgConsumer).toBe(250 + 600);

    // Test recycling rate offset (up to 40% reduction of waste volume component)
    const recycledHigh100 = calculateCarbonFootprint({
      ...baseInputs,
      wasteVolume: 'high',
      recyclingRate: 100,
      shoppingHabits: 'minimalist'
    }).waste;
    // 800 * (1 - 0.4) + 150 = 480 + 150 = 630
    expect(recycledHigh100).toBe(630);

    const recycledHigh50 = calculateCarbonFootprint({
      ...baseInputs,
      wasteVolume: 'high',
      recyclingRate: 50,
      shoppingHabits: 'minimalist'
    }).waste;
    // 800 * (1 - 0.2) + 150 = 640 + 150 = 790
    expect(recycledHigh50).toBe(790);
  });
});

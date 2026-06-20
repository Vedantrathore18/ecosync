// Carbon Footprint Calculations Utility (in kg CO2e per year)

export interface CarbonInputs {
  // Travel
  carKm: number;
  carFuelType: 'petrol' | 'diesel' | 'hybrid' | 'electric' | 'none';
  flightsShort: number; // annual hours
  flightsLong: number;  // annual hours
  transitHours: number; // weekly hours

  // Home Energy
  electricityKwh: number; // monthly
  greenEnergyPercent: number; // 0 to 100
  heatingFuel: 'natural-gas' | 'lpg' | 'heating-oil' | 'wood' | 'none';
  heatingKwh: number; // monthly equivalent in kWh

  // Diet
  dietType: 'heavy-meat' | 'average-meat' | 'low-meat' | 'vegetarian' | 'vegan';
  localFoodPercent: number; // 0 to 100

  // Waste & Consumption
  wasteVolume: 'high' | 'average' | 'low';
  recyclingRate: number; // 0 to 100
  shoppingHabits: 'heavy-consumer' | 'average-consumer' | 'minimalist';
}

export const defaultInputs: CarbonInputs = {
  carKm: 8000,
  carFuelType: 'petrol',
  flightsShort: 5,
  flightsLong: 10,
  transitHours: 2,
  electricityKwh: 300,
  greenEnergyPercent: 0,
  heatingFuel: 'natural-gas',
  heatingKwh: 400,
  dietType: 'average-meat',
  localFoodPercent: 20,
  wasteVolume: 'average',
  recyclingRate: 30,
  shoppingHabits: 'average-consumer',
};

// Benchmarks (in tonnes CO2e per year)
export const BENCHMARKS = {
  globalAverage: 4.7,
  parisGoal: 2.0,
  usAverage: 14.5,
  indiaAverage: 1.9,
  euAverage: 6.4,
};

export interface CarbonResults {
  travel: number; // in kg
  home: number;   // in kg
  diet: number;   // in kg
  waste: number;  // in kg
  total: number;  // in kg (sum of all sectors)
}

export function calculateCarbonFootprint(inputs: CarbonInputs): CarbonResults {
  // 1. Travel Calculations
  let carEmissions = 0;
  const carFactors = {
    petrol: 0.17,    // kg CO2e per km
    diesel: 0.16,
    hybrid: 0.10,
    electric: 0.05,  // assuming grid electricity intensity
    none: 0,
  };
  carEmissions = inputs.carKm * carFactors[inputs.carFuelType];

  // Flights: short-haul (~150 kg/hr), long-haul (~110 kg/hr)
  const flightEmissions = (inputs.flightsShort * 150) + (inputs.flightsLong * 110);

  // Public Transit: weekly hours * 52 weeks * ~1.2 kg CO2e per hour of average transit
  const transitEmissions = inputs.transitHours * 52 * 1.2;

  const travelTotal = carEmissions + flightEmissions + transitEmissions;

  // 2. Home Energy Calculations
  // Electricity: monthly * 12 * 0.38 kg/kWh, offset by green energy percentage
  const gridIntensity = 0.38; // kg CO2e per kWh
  const baseElectricityEmissions = inputs.electricityKwh * 12 * gridIntensity;
  const electricityEmissions = baseElectricityEmissions * (1 - inputs.greenEnergyPercent / 100);

  // Heating: monthly * 12 * factor
  const heatingFactors = {
    'natural-gas': 0.18, // kg CO2e per kWh
    'lpg': 0.24,
    'heating-oil': 0.27,
    'wood': 0.03,
    'none': 0,
  };
  const heatingEmissions = inputs.heatingKwh * 12 * heatingFactors[inputs.heatingFuel];

  const homeTotal = electricityEmissions + heatingEmissions;

  // 3. Diet Calculations
  const dietBase = {
    'heavy-meat': 2500, // kg CO2e/year
    'average-meat': 1700,
    'low-meat': 1200,
    'vegetarian': 900,
    'vegan': 500,
  };
  let dietEmissions = dietBase[inputs.dietType];
  
  // Local food offset (up to 10% reduction for 100% local sourcing)
  const localOffsetFactor = 0.1 * (inputs.localFoodPercent / 100);
  dietEmissions = dietEmissions * (1 - localOffsetFactor);

  const dietTotal = dietEmissions;

  // 4. Waste & Consumption Calculations
  const wasteBase = {
    high: 800,    // kg CO2e/year
    average: 500,
    low: 250,
  };
  let wasteEmissions = wasteBase[inputs.wasteVolume];
  // Recycling offset (up to 40% reduction for 100% recycling rate)
  const recyclingOffsetFactor = 0.4 * (inputs.recyclingRate / 100);
  wasteEmissions = wasteEmissions * (1 - recyclingOffsetFactor);

  const shoppingBase = {
    'heavy-consumer': 1200,
    'average-consumer': 600,
    'minimalist': 150,
  };
  const shoppingEmissions = shoppingBase[inputs.shoppingHabits];

  const wasteTotal = wasteEmissions + shoppingEmissions;

  // Total
  const total = travelTotal + homeTotal + dietTotal + wasteTotal;

  // Round values for display clarity
  return {
    travel: Math.round(travelTotal),
    home: Math.round(homeTotal),
    diet: Math.round(dietTotal),
    waste: Math.round(wasteTotal),
    total: Math.round(total),
  };
}

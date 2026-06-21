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

// ============================================================================
// EMISSION FACTORS & CONSTANTS (EPA / DEFRA / IPCC)
// ============================================================================

// kg CO2e per km, by vehicle fuel type
export const CAR_EMISSION_FACTORS = {
  petrol: 0.17,
  diesel: 0.16,
  hybrid: 0.10,
  electric: 0.05,
  none: 0,
} as const;

// kg CO2e per hour, by flight type (short/long haul)
export const FLIGHT_EMISSION_FACTORS = {
  shortHaul: 150,
  longHaul: 110,
} as const;

// kg CO2e per transit hour (weekly hours * 52 weeks * factor)
export const TRANSIT_EMISSION_FACTOR = 1.2;

// kg CO2e per kWh, electricity grid carbon intensity
export const GRID_ELECTRICITY_INTENSITY = 0.38;

// kg CO2e per kWh, by heating fuel type
export const HEATING_EMISSION_FACTORS = {
  'natural-gas': 0.18,
  'lpg': 0.24,
  'heating-oil': 0.27,
  'wood': 0.03,
  'none': 0,
} as const;

// Base kg CO2e emissions per year, by diet type
export const DIET_BASE_EMISSIONS = {
  'heavy-meat': 2500,
  'average-meat': 1700,
  'low-meat': 1200,
  'vegetarian': 900,
  'vegan': 500,
} as const;

// Maximum local food offset ratio (up to 10% reduction for 100% local food)
export const LOCAL_FOOD_MAX_REDUCTION_FACTOR = 0.1;

// Base kg CO2e emissions per year, by waste volume
export const WASTE_BASE_EMISSIONS = {
  high: 800,
  average: 500,
  low: 250,
} as const;

// Maximum recycling offset ratio (up to 40% reduction for 100% recycling rate)
export const RECYCLING_MAX_REDUCTION_FACTOR = 0.4;

// Base kg CO2e emissions per year, by shopping habits
export const SHOPPING_BASE_EMISSIONS = {
  'heavy-consumer': 1200,
  'average-consumer': 600,
  'minimalist': 150,
} as const;

// Tree absorption equivalency factor in kg CO2e per tree per year
export const TREE_EQUIVALENCY_FACTOR = 22;

// ============================================================================
// CALCULATION FUNCTIONS
// ============================================================================

/**
 * Calculates a user's total annual carbon footprint in kg CO2e,
 * broken down by sector (travel, home, diet, waste).
 * @param inputs - User-provided lifestyle data from the calculator
 * @returns Sector-by-sector and total emissions in kg CO2e/year
 */
export function calculateCarbonFootprint(inputs: CarbonInputs): CarbonResults {
  // 1. Travel Calculations
  const carEmissions = inputs.carKm * CAR_EMISSION_FACTORS[inputs.carFuelType];

  // Flights: short-haul (~150 kg/hr), long-haul (~110 kg/hr)
  const flightEmissions = (inputs.flightsShort * FLIGHT_EMISSION_FACTORS.shortHaul) + 
                          (inputs.flightsLong * FLIGHT_EMISSION_FACTORS.longHaul);

  // Public Transit: weekly hours * 52 weeks * transit factor
  const transitEmissions = inputs.transitHours * 52 * TRANSIT_EMISSION_FACTOR;

  const travelTotal = carEmissions + flightEmissions + transitEmissions;

  // 2. Home Energy Calculations
  // Electricity: monthly * 12 * gridIntensity, offset by green energy percentage
  const baseElectricityEmissions = inputs.electricityKwh * 12 * GRID_ELECTRICITY_INTENSITY;
  const electricityEmissions = baseElectricityEmissions * (1 - inputs.greenEnergyPercent / 100);

  // Heating: monthly * 12 * heatingFactor
  const heatingEmissions = inputs.heatingKwh * 12 * HEATING_EMISSION_FACTORS[inputs.heatingFuel];

  const homeTotal = electricityEmissions + heatingEmissions;

  // 3. Diet Calculations
  let dietEmissions = DIET_BASE_EMISSIONS[inputs.dietType];
  
  // Local food offset (up to 10% reduction for 100% local sourcing)
  const localOffsetFactor = LOCAL_FOOD_MAX_REDUCTION_FACTOR * (inputs.localFoodPercent / 100);
  dietEmissions = dietEmissions * (1 - localOffsetFactor);

  const dietTotal = dietEmissions;

  // 4. Waste & Consumption Calculations
  let wasteEmissions = WASTE_BASE_EMISSIONS[inputs.wasteVolume];
  // Recycling offset (up to 40% reduction for 100% recycling rate)
  const recyclingOffsetFactor = RECYCLING_MAX_REDUCTION_FACTOR * (inputs.recyclingRate / 100);
  wasteEmissions = wasteEmissions * (1 - recyclingOffsetFactor);

  const shoppingEmissions = SHOPPING_BASE_EMISSIONS[inputs.shoppingHabits];

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

export interface SimulationParameters {
  carReduction: number;
  flightReduction: number;
  energyRenewable: number;
  meatReduction: number;
  wasteRecycling: number;
}

/**
 * Calculates a hypothetical simulated annual carbon footprint in kg CO2e,
 * modeling slider adjustments against the user's base profile.
 * @param inputs - Original baseline lifestyle inputs
 * @param simulations - User-selected percentage reductions or target shares
 * @returns Hypothetical sector-by-sector and total emissions in kg CO2e/year
 */
export function calculateSimulatedCarbonFootprint(
  inputs: CarbonInputs,
  simulations: SimulationParameters
): CarbonResults {
  // 1. Travel Calculations
  const carEmissions = inputs.carKm * (1 - simulations.carReduction / 100) * CAR_EMISSION_FACTORS[inputs.carFuelType];

  // Flights: short-haul (~150 kg/hr), long-haul (~110 kg/hr)
  const flightEmissions = ((inputs.flightsShort * FLIGHT_EMISSION_FACTORS.shortHaul) + 
                           (inputs.flightsLong * FLIGHT_EMISSION_FACTORS.longHaul)) * 
                          (1 - simulations.flightReduction / 100);

  // Public Transit
  const transitEmissions = inputs.transitHours * 52 * TRANSIT_EMISSION_FACTOR;

  const travelTotal = carEmissions + flightEmissions + transitEmissions;

  // 2. Home Energy Calculations
  const baseElectricityEmissions = inputs.electricityKwh * 12 * GRID_ELECTRICITY_INTENSITY;
  const electricityEmissions = baseElectricityEmissions * (1 - simulations.energyRenewable / 100);

  // Heating: monthly * 12 * heatingFactor
  const heatingEmissions = inputs.heatingKwh * 12 * HEATING_EMISSION_FACTORS[inputs.heatingFuel];

  const homeTotal = electricityEmissions + heatingEmissions;

  // 3. Diet Calculations
  const currentDietBase = DIET_BASE_EMISSIONS[inputs.dietType];
  const simulatedDietBase = currentDietBase * (1 - simulations.meatReduction / 100) + 
                            DIET_BASE_EMISSIONS['vegan'] * (simulations.meatReduction / 100);
  
  const localOffsetFactor = LOCAL_FOOD_MAX_REDUCTION_FACTOR * (inputs.localFoodPercent / 100);
  const dietTotal = simulatedDietBase * (1 - localOffsetFactor);

  // 4. Waste & Consumption Calculations
  const baseWasteEmissions = WASTE_BASE_EMISSIONS[inputs.wasteVolume];
  const recyclingOffsetFactor = RECYCLING_MAX_REDUCTION_FACTOR * (simulations.wasteRecycling / 100);
  const wasteEmissions = baseWasteEmissions * (1 - recyclingOffsetFactor);

  const shoppingEmissions = SHOPPING_BASE_EMISSIONS[inputs.shoppingHabits];

  const wasteTotal = wasteEmissions + shoppingEmissions;

  // Total
  const total = travelTotal + homeTotal + dietTotal + wasteTotal;

  return {
    travel: Math.round(travelTotal),
    home: Math.round(homeTotal),
    diet: Math.round(dietTotal),
    waste: Math.round(wasteTotal),
    total: Math.round(total),
  };
}

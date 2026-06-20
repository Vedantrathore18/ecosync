import { describe, it, expect } from 'vitest';
import { generateBotResponse } from '../utils/aiReasoning';
import { CarbonInputs, CarbonResults, calculateCarbonFootprint } from '../utils/calculations';

describe('AI Eco-Coach Reasoning Suite', () => {
  const mockInputs: CarbonInputs = {
    carKm: 10000,
    carFuelType: 'petrol',
    flightsShort: 5,
    flightsLong: 10,
    transitHours: 2,
    electricityKwh: 300,
    greenEnergyPercent: 20,
    heatingFuel: 'natural-gas',
    heatingKwh: 400,
    dietType: 'heavy-meat',
    localFoodPercent: 10,
    wasteVolume: 'average',
    recyclingRate: 40,
    shoppingHabits: 'heavy-consumer',
  };

  const mockResults: CarbonResults = calculateCarbonFootprint(mockInputs);
  
  const mockHighest = {
    name: 'diet',
    value: mockResults.diet,
    label: 'Diet & Nutrition'
  };

  it('should return context-aware travel suggestions when query matches transportation keywords', () => {
    const response = generateBotResponse('travel advice', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('transportation footprint');
    expect(response).toContain('Vehicle Transition');
    expect(response).toContain('petrol');
  });

  it('should suggest green utility tariffs when renewable share is under 100%', () => {
    const response = generateBotResponse('home electricity options', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('home energy footprint');
    expect(response).toContain('Green Tariff');
    expect(response).toContain('20%');
  });

  it('should applaud the user when they have 100% green energy tariff', () => {
    const greenInputs = { ...mockInputs, greenEnergyPercent: 100 };
    const response = generateBotResponse('solar power energy', greenInputs, mockResults, 150, mockHighest);
    expect(response).toContain('home energy footprint');
    expect(response).toContain('Clean Energy Powerhouse');
  });

  it('should return vegetarian/vegan transition details when diet query is sent for meat eaters', () => {
    const response = generateBotResponse('food footprint', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('heavy-meat');
    expect(response).toContain('Dietary Shifts');
    expect(response).toContain('veganism');
  });

  it('should return supportive message for eco-friendly diet when diet query is sent for vegans', () => {
    const veganInputs = { ...mockInputs, dietType: 'vegan' as const };
    const response = generateBotResponse('my food footprint', veganInputs, mockResults, 150, mockHighest);
    expect(response).toContain('Eco-Conscious Eating');
    expect(response).toContain('Being vegan');
  });

  it('should return recycling and consumer tips when query matches waste keywords', () => {
    const response = generateBotResponse('shopping waste habits', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('waste & consumption footprint');
    expect(response).toContain('Conscious Consumption');
    expect(response).toContain('Recycling Goals');
    expect(response).toContain('40%');
  });

  it('should output positive recycling note when user is already recycling at 80%+', () => {
    const highRecyclingInputs = { ...mockInputs, recyclingRate: 85 };
    const response = generateBotResponse('recycle trash', highRecyclingInputs, mockResults, 150, mockHighest);
    expect(response).toContain('Waste Management');
    expect(response).toContain('Great job maintaining a high recycling rate');
  });

  it('should output the highest emitter sector dynamically based on highest parameter', () => {
    const response = generateBotResponse('what is my highest source?', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('highest emission source is');
    expect(response).toContain('Diet & Nutrition');
  });

  it('should output custom action plan steps referencing the highest sector', () => {
    const response = generateBotResponse('give me a plan', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('3-Step Action Plan');
    expect(response).toContain('Diet & Nutrition');
  });

  it('should correctly explain points criteria and requirements for next level', () => {
    const response = generateBotResponse('how do I earn points', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('150 Eco-Hero points');
    expect(response).toContain('Level 2 Eco-Hero');
    expect(response).toContain('50 more points');
  });

  it('should return helpful fallback prompts when query is not matched', () => {
    const response = generateBotResponse('hello how are you', mockInputs, mockResults, 150, mockHighest);
    expect(response).toContain('I\'m here to help you navigate');
    expect(response).toContain('3-step action plan');
  });
});

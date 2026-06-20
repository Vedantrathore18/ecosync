import { CarbonInputs, CarbonResults } from './calculations';

export function generateBotResponse(
  query: string,
  inputs: CarbonInputs,
  results: CarbonResults,
  points: number,
  highest: { name: string; value: number; label: string }
): string {
  const normalizedQuery = query.toLowerCase();

  // 1. Travel query
  if (
    normalizedQuery.includes('travel') ||
    normalizedQuery.includes('car') ||
    normalizedQuery.includes('flight') ||
    normalizedQuery.includes('transit') ||
    normalizedQuery.includes('transport')
  ) {
    let advice = `Based on your profile, your transportation footprint is **${(results.travel / 1000).toFixed(1)} tonnes CO₂e/yr**. `;
    
    if (inputs.carFuelType === 'petrol' || inputs.carFuelType === 'diesel') {
      advice += `\n\n- **Vehicle Transition**: Your ${inputs.carFuelType} car consumes a lot of carbon. If you drive **${inputs.carKm} km/yr**, switching to a hybrid would save approx. **${Math.round(inputs.carKm * 0.07)} kg CO₂e**, and going electric would save **${Math.round(inputs.carKm * 0.12)} kg CO₂e** annually!`;
    }
    
    if (inputs.flightsLong > 0 || inputs.flightsShort > 0) {
      advice += `\n- **Flight Reductions**: You log **${inputs.flightsShort + inputs.flightsLong} hours** of flying annually. Committing to substitute just one long flight with rail travel saves **1,100 kg CO₂e**!`;
    }

    advice += `\n- **Commuter Habits**: Try walking or biking for all trips under 3km, which can reduce your travel emissions by up to 15%.`;
    return advice;
  }

  // 2. Home Energy query
  if (
    normalizedQuery.includes('energy') ||
    normalizedQuery.includes('electricity') ||
    normalizedQuery.includes('power') ||
    normalizedQuery.includes('heating') ||
    normalizedQuery.includes('solar') ||
    normalizedQuery.includes('gas')
  ) {
    let advice = `Your home energy footprint is **${(results.home / 1000).toFixed(1)} tonnes CO₂e/yr**. `;

    if (inputs.greenEnergyPercent < 100) {
      advice += `\n\n- **Green Tariff**: Your current renewable share is only **${inputs.greenEnergyPercent}%**. Upgrading to a 100% green energy tariff with your grid provider will eliminate up to **${Math.round(inputs.electricityKwh * 12 * 0.38 * (1 - inputs.greenEnergyPercent / 100))} kg CO₂e** from your annual electric utility footprint!`;
    } else {
      advice += `\n\n- **Clean Energy Powerhouse**: Excellent work drawing 100% green electricity!`;
    }

    if (inputs.heatingFuel === 'natural-gas' || inputs.heatingFuel === 'heating-oil') {
      advice += `\n- **Heating Efficiency**: You are heating with **${inputs.heatingFuel}**. Lowering your winter thermostat by just 1°C can save **300 kg CO₂e/yr** without major costs. Or consider transitioning to a clean heat pump, saving **1,800 kg CO₂e/yr**!`;
    }

    advice += `\n- **Standby Power**: Unplug vampire devices or install smart power strips to save an extra **120 kg CO₂e/yr**.`;
    return advice;
  }

  // 3. Diet query
  if (
    normalizedQuery.includes('diet') ||
    normalizedQuery.includes('food') ||
    normalizedQuery.includes('meat') ||
    normalizedQuery.includes('vegan') ||
    normalizedQuery.includes('vegetarian')
  ) {
    let advice = `Your diet generates **${(results.diet / 1000).toFixed(1)} tonnes CO₂e/yr** based on your **${inputs.dietType}** profile. `;

    if (inputs.dietType === 'heavy-meat' || inputs.dietType === 'average-meat') {
      advice += `\n\n- **Dietary Shifts**: Shifting your daily meat habits by joining the 'Meatless Monday' movement (1 day vegetarian/week) cuts **250 kg CO₂e/yr**. Transitioning fully to vegetarianism cuts **${inputs.dietType === 'heavy-meat' ? '1,600' : '800'} kg CO₂e/yr**, and veganism cuts **${inputs.dietType === 'heavy-meat' ? '2,000' : '1,200'} kg CO₂e/yr**!`;
    } else {
      advice += `\n\n- **Eco-Conscious Eating**: Being ${inputs.dietType} keeps your food emissions extremely low.`;
    }

    if (inputs.localFoodPercent < 50) {
      advice += `\n- **Local Sourcing**: Sourcing 50% or more of your groceries from local farms rather than international air-freight will deduct another **100 kg CO₂e/yr** and support sustainable soil chemistry.`;
    }

    return advice;
  }

  // 4. Waste & Shopping query
  if (
    normalizedQuery.includes('waste') ||
    normalizedQuery.includes('recycle') ||
    normalizedQuery.includes('trash') ||
    normalizedQuery.includes('shopping') ||
    normalizedQuery.includes('plastic') ||
    normalizedQuery.includes('thrift')
  ) {
    let advice = `Your waste & consumption footprint is **${(results.waste / 1000).toFixed(1)} tonnes CO₂e/yr**. `;

    if (inputs.shoppingHabits === 'heavy-consumer') {
      advice += `\n\n- **Conscious Consumption**: Your heavy shopping profile adds **1,200 kg CO₂e/yr**. Committing to buying clothing second-hand (thrift stores) cuts this portion by **400 kg CO₂e/yr**, and taking a 'Buy Nothing New' month resets spending habits and saves **500 kg CO₂e/yr**.`;
    }

    if (inputs.recyclingRate < 70) {
      advice += `\n- **Recycling Goals**: You are recycling **${inputs.recyclingRate}%** of your household waste. Boosting this to 80%+ through strict packaging sorting and kitchen composting will reduce landfill methane generation by **150 kg CO₂e/yr**.`;
    } else {
      advice += `\n- **Waste Management**: Great job maintaining a high recycling rate! Keep composting organic waste.`;
    }

    return advice;
  }

  // 5. Highest emitter query
  if (
    normalizedQuery.includes('highest') ||
    normalizedQuery.includes('source') ||
    normalizedQuery.includes('worst') ||
    normalizedQuery.includes('main')
  ) {
    return `Your absolute highest emission source is **${highest.label}** which generates **${(highest.value / 1000).toFixed(1)} tonnes CO₂e/yr** (${Math.round((highest.value / results.total) * 100)}% of your footprint). 

I highly recommend visiting the **Green Roadmap** tab to commit to the specific actions listed under the **${highest.name}** filter! Resolving this sector first will yield your fastest path to a net-zero footprint.`;
  }

  // 6. Action plan query
  if (
    normalizedQuery.includes('plan') ||
    normalizedQuery.includes('action') ||
    normalizedQuery.includes('roadmap') ||
    normalizedQuery.includes('step')
  ) {
    return `Here is a custom **3-Step Action Plan** curated for your current profile:

1. **Focus on ${highest.label}**: Tackle your highest emitter first by navigating to the **Green Roadmap** catalog.
2. **Upgrade to 100% Green Energy**: In the simulator, check the effect of green power. Swapping your home utility tariff represents a huge emission cut with zero daily friction.
3. **Earn Eco-Hero points**: Tick off daily checklist habits on the **Dashboard** (like washing laundry cold or going meat-free) to gamify your path and build lasting habits.`;
  }

  // 7. Points/Rank query
  if (
    normalizedQuery.includes('point') ||
    normalizedQuery.includes('score') ||
    normalizedQuery.includes('rank') ||
    normalizedQuery.includes('hero') ||
    normalizedQuery.includes('badge')
  ) {
    const currentLevel = Math.floor(points / 100) + 1;
    const ptsToNext = 100 - (points % 100);
    return `You currently have **${points} Eco-Hero points**, which puts you at **Level ${currentLevel} Eco-Hero**!

You need **${ptsToNext} more points** to reach Level ${currentLevel + 1}. You can earn points by:
- Completing the 5-question trivia quiz on the **Eco Hub** (+10 points per answer, +50 points perfect bonus).
- Ticking off daily checklist habits on your **Dashboard** (+15 points per habit).
- Committing to and completing long-term roadmap actions (+30 to +100 points based on impact!).`;
  }

  // Default Fallback
  return `I'm here to help you navigate your journey. Try asking me one of these topics:
- *"How can I reduce my travel footprint?"*
- *"What is my highest emission source?"*
- *"Give me a 3-step action plan"*
- *"How do I earn more Eco-Hero points?"*`;
}

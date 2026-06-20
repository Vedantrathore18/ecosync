import React, { useState, useEffect } from 'react';
import { CarbonResults, BENCHMARKS, CarbonInputs } from '../utils/calculations';
import { TrendingDown, Award, Lightbulb, CheckSquare } from 'lucide-react';
import { ECO_ACTIONS } from '../utils/actionData';

interface DashboardProps {
  results: CarbonResults;
  inputs: CarbonInputs;
  onNavigateToRoadmap: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ results, inputs, onNavigateToRoadmap }) => {
  const [copied, setCopied] = useState(false);
  // Simulator states (percentages of reduction)
  const [carReduction, setCarReduction] = useState(0);
  const [flightReduction, setFlightReduction] = useState(0);
  const [energyRenewable, setEnergyRenewable] = useState(inputs.greenEnergyPercent);
  const [meatReduction, setMeatReduction] = useState(0);
  const [wasteRecycling, setWasteRecycling] = useState(inputs.recyclingRate);

  // Gamification: Daily Habit checklist
  const [dailyHabits, setDailyHabits] = useState<{ id: string; text: string; co2: number; checked: boolean }[]>(() => {
    const saved = localStorage.getItem('eco-daily-habits');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: 'walk-trip', text: 'Walked or cycled for a short trip (instead of driving)', co2: 1.5, checked: false },
      { id: 'plant-meal', text: 'Ate a fully plant-based meal', co2: 2.1, checked: false },
      { id: 'reusable', text: 'Used only reusable bags, bottles, and cups today', co2: 0.5, checked: false },
      { id: 'vampire', text: 'Unplugged vampire appliances / turned off standby', co2: 0.4, checked: false },
      { id: 'cold-wash', text: 'Washed laundry at 30°C / cold cycle', co2: 0.8, checked: false },
    ];
  });

  const [points, setPoints] = useState<number>(() => {
    return Number(localStorage.getItem('eco-user-points')) || 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    return Number(localStorage.getItem('eco-user-streak')) || 0;
  });

  // Calculate simulated results
  const simulatedResults = {
    travel: Math.round(
      // Car savings
      (results.travel * 0.6 * (1 - carReduction / 100)) + 
      // Flight savings
      (results.travel * 0.3 * (1 - flightReduction / 100)) + 
      // Transit (stays baseline in simulation)
      (results.travel * 0.1)
    ),
    home: Math.round(
      // Electricity scaled by renewable energy
      (results.home * 0.6 * (1 - energyRenewable / 100)) + 
      // Heating baseline
      (results.home * 0.4)
    ),
    diet: Math.round(
      // Diet emissions scaled by meat reduction
      results.diet * (1 - (meatReduction / 100) * 0.4) // max 40% reduction for meat reduction (e.g. going vegetarian)
    ),
    waste: Math.round(
      // Waste emissions scaled by recycling rate
      results.waste * (1 - (wasteRecycling / 100) * 0.25)
    ),
  };

  const simulatedTotal = simulatedResults.travel + simulatedResults.home + simulatedResults.diet + simulatedResults.waste;
  const originalTotal = results.total;
  const potentialSavings = originalTotal - simulatedTotal;
  const percentSaved = originalTotal > 0 ? Math.round((potentialSavings / originalTotal) * 100) : 0;

  // Sync Daily Habits to localStorage
  useEffect(() => {
    localStorage.setItem('eco-daily-habits', JSON.stringify(dailyHabits));
    localStorage.setItem('eco-user-points', points.toString());
    localStorage.setItem('eco-user-streak', streak.toString());
  }, [dailyHabits, points, streak]);

  const handleHabitToggle = (id: string) => {
    setDailyHabits(prev => {
      const updated = prev.map(habit => {
        if (habit.id === id) {
          const newChecked = !habit.checked;
          if (newChecked) {
            setPoints(pts => pts + 15);
          } else {
            setPoints(pts => Math.max(0, pts - 15));
          }
          return { ...habit, checked: newChecked };
        }
        return habit;
      });

      // Calculate if all checked today
      const allChecked = updated.every(h => h.checked);
      if (allChecked) {
        setStreak(s => s + 1);
        setPoints(pts => pts + 50); // Bonus points
      }

      return updated;
    });
  };

  const handleExportReport = () => {
    const committedIds = JSON.parse(localStorage.getItem('eco-committed-actions') || '[]');
    const completedIds = JSON.parse(localStorage.getItem('eco-completed-actions') || '[]');
    
    const committedActions = ECO_ACTIONS.filter((a) => committedIds.includes(a.id));
    const completedActions = ECO_ACTIONS.filter((a) => completedIds.includes(a.id));
    
    const activeSavings = committedActions.reduce((sum, a) => sum + a.savings, 0);
    const completedSavings = completedActions.reduce((sum, a) => sum + a.savings, 0);
    const treeEquivalence = Math.max(1, Math.round(completedSavings / 22));

    const reportContent = `==================================================
        ECOSYNC PERSONAL SUSTAINABILITY REPORT
==================================================
Generated on: ${new Date().toLocaleDateString()}
User Level: Level ${Math.floor(points / 100) + 1} Eco-Hero
Total Points: ${points} pts
Daily Streak: ${streak} days

--------------------------------------------------
1. CARBON FOOTPRINT ANALYSIS
--------------------------------------------------
Annual Carbon Footprint: ${tonnesTotal} tonnes CO2e/year
Comparison: ${originalTotal < BENCHMARKS.globalAverage * 1000 
  ? `${Math.round((1 - originalTotal / (BENCHMARKS.globalAverage * 1000)) * 100)}% below` 
  : `${Math.round((originalTotal / (BENCHMARKS.globalAverage * 1000) - 1) * 100)}% above`} the global average (${BENCHMARKS.globalAverage} t)

Category Breakdown:
- Transportation: ${(results.travel / 1000).toFixed(2)} tonnes CO2e/yr (${results.travel} kg)
- Home Energy:    ${(results.home / 1000).toFixed(2)} tonnes CO2e/yr (${results.home} kg)
- Diet/Nutrition: ${(results.diet / 1000).toFixed(2)} tonnes CO2e/yr (${results.diet} kg)
- Waste/Shopping: ${(results.waste / 1000).toFixed(2)} tonnes CO2e/yr (${results.waste} kg)

--------------------------------------------------
2. ROADMAP COMMITMENTS & SAVINGS
--------------------------------------------------
Committed Actions in Progress (${committedActions.length}):
${committedActions.length > 0 
  ? committedActions.map(a => `- [ ] ${a.title} (-${a.savings} kg CO2e/yr)`).join('\n')
  : '- None (Visit the Green Roadmap tab to start committing to reductions!)'}

Permanent Reductions Achieved (${completedActions.length}):
${completedActions.length > 0 
  ? completedActions.map(a => `- [x] ${a.title} (-${a.savings} kg CO2e/yr)`).join('\n')
  : '- None yet'}

Current Progress:
- Active Commits Potential Savings: ${activeSavings} kg CO2e/yr
- Locked-in Achieved Reductions:   ${completedSavings} kg CO2e/yr
- Offset Equivalency: Equivalent to growing ${treeEquivalence} mature urban trees/year.

--------------------------------------------------
3. HOUSEHOLD INPUT PROFILE DETAILS
--------------------------------------------------
- Vehicle Fuel Type:      ${inputs.carFuelType.toUpperCase()}
- Annual Driving Distance: ${inputs.carKm} km
- Short-Haul Flights:     ${inputs.flightsShort} hours/year
- Long-Haul Flights:      ${inputs.flightsLong} hours/year
- Public Transit:         ${inputs.transitHours} hours/week
- Electricity Usage:      ${inputs.electricityKwh} kWh/month (Green energy: ${inputs.greenEnergyPercent}%)
- Heating Consumption:    ${inputs.heatingKwh} kWh/month (${inputs.heatingFuel})
- Dietary Habits:         ${inputs.dietType.toUpperCase()} (Locally sourced: ${inputs.localFoodPercent}%)
- Waste/Trash Output:     ${inputs.wasteVolume.toUpperCase()} (Recycling rate: ${inputs.recyclingRate}%)
- Shopping Habits:        ${inputs.shoppingHabits.toUpperCase()}

==================================================
           Thank you for utilizing EcoSync!
       Join the movement toward a net-zero future.
==================================================`;

    const element = document.createElement("a");
    const file = new Blob([reportContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `ecosync_sustainability_report_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyShareTemplate = () => {
    const committedIds = JSON.parse(localStorage.getItem('eco-committed-actions') || '[]');
    const completedIds = JSON.parse(localStorage.getItem('eco-completed-actions') || '[]');
    const text = `🌱 I just checked my carbon footprint on EcoSync! 

My annual footprint is ${tonnesTotal} tonnes of CO2e. 
- In progress commitments: ${committedIds.length} goals
- Completed offsets: ${completedIds.length} goals locked in

Take control of your footprint and build eco-friendly habits on EcoSync. Let's reach Net-Zero together!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const resetDailyHabits = () => {
    setDailyHabits(prev => prev.map(h => ({ ...h, checked: false })));
  };

  // Convert kg to tonnes for display
  const tonnesTotal = (originalTotal / 1000).toFixed(1);
  const tonnesSimulated = (simulatedTotal / 1000).toFixed(1);
  const tonnesSavings = (potentialSavings / 1000).toFixed(1);

  // SVG Chart details
  const totalVal = results.travel + results.home + results.diet + results.waste;
  const travelPct = totalVal > 0 ? (results.travel / totalVal) * 100 : 25;
  const homePct = totalVal > 0 ? (results.home / totalVal) * 100 : 25;
  const dietPct = totalVal > 0 ? (results.diet / totalVal) * 100 : 25;
  const wastePct = totalVal > 0 ? (results.waste / totalVal) * 100 : 25;

  // Donut chart stroke calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  
  const strokeTravel = circumference * (travelPct / 100);
  const strokeHome = circumference * (homePct / 100);
  const strokeDiet = circumference * (dietPct / 100);
  const strokeWaste = circumference * (wastePct / 100);

  const offsetTravel = 0;
  const offsetHome = strokeTravel;
  const offsetDiet = strokeTravel + strokeHome;
  const offsetWaste = strokeTravel + strokeHome + strokeDiet;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Top Banner stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--spacing-lg)' }} className="dashboard-top-grid">
        {/* Main Stats Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
              <span className="badge badge-low" style={{ marginBottom: 'var(--spacing-sm)' }}>Calculated Profile</span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button 
                  onClick={handleExportReport}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Export detailed report as a text file"
                >
                  📥 Export Final Report
                </button>
                <button 
                  onClick={handleCopyShareTemplate}
                  className="btn btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Copy a carbon status template to share on LinkedIn"
                >
                  {copied ? '✅ Copied!' : '📋 Copy Share Text'}
                </button>
              </div>
            </div>
            <h2 style={{ fontSize: 'var(--font-4xl)', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
              {tonnesTotal} <span style={{ fontSize: 'var(--font-xl)', fontWeight: 500, color: 'var(--text-secondary)' }}>tonnes CO₂e/yr</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: 'var(--spacing-xs)' }}>
              {originalTotal < BENCHMARKS.globalAverage * 1000 ? (
                <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
                  Excellent! Your carbon footprint is {Math.round((1 - originalTotal / (BENCHMARKS.globalAverage * 1000)) * 100)}% below the global average ({BENCHMARKS.globalAverage} t).
                </span>
              ) : (
                <span style={{ color: 'var(--gold)', fontWeight: 600 }}>
                  Your footprint is {Math.round((originalTotal / (BENCHMARKS.globalAverage * 1000) - 1) * 100)}% above the global average ({BENCHMARKS.globalAverage} t).
                </span>
              )}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }} className="benchmark-grid">
            <div style={{ borderLeft: '3px solid var(--accent-primary)', paddingLeft: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'block' }}>Paris Agreement Goal</span>
              <span style={{ fontWeight: 'bold' }}>{BENCHMARKS.parisGoal} t</span>
            </div>
            <div style={{ borderLeft: '3px solid var(--sky)', paddingLeft: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'block' }}>US National Average</span>
              <span style={{ fontWeight: 'bold' }}>{BENCHMARKS.usAverage} t</span>
            </div>
            <div style={{ borderLeft: '3px solid var(--gold)', paddingLeft: 'var(--spacing-sm)' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)', display: 'block' }}>EU Average</span>
              <span style={{ fontWeight: 'bold' }}>{BENCHMARKS.euAverage} t</span>
            </div>
          </div>
        </div>

        {/* Gamification Level Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div 
            style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--gold), #f59e0b)',
              color: '#0b0f19',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 15px rgba(251, 191, 36, 0.4)',
              marginBottom: 'var(--spacing-sm)'
            }}
          >
            <Award size={30} />
          </div>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 'bold' }}>Level {Math.floor(points / 100) + 1} Eco-Hero</h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginTop: '4px' }}>
            {points} Total Points • {streak} Day Streak
          </p>

          <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '3px', marginTop: 'var(--spacing-md)', overflow: 'hidden' }}>
            <div 
              style={{ 
                width: `${points % 100}%`, 
                height: '100%', 
                backgroundColor: 'var(--gold)', 
                borderRadius: '3px',
                transition: 'width 0.4s'
              }} 
            />
          </div>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {100 - (points % 100)} pts to next rank
          </span>
        </div>
      </div>

      {/* Main Analysis: Chart + Daily Habits Checklist */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="dashboard-mid-grid">
        {/* Interactive Chart Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700 }}>Emission Breakdown</h3>
          
          <div style={{ display: 'flex', justifyContent: 'center', margin: 'var(--spacing-md) 0' }}>
            {/* Custom SVG Donut Chart */}
            <div style={{ position: 'relative', width: '180px', height: '180px' }}>
              <svg width="100%" height="100%" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="70" cy="70" r={radius} fill="transparent" stroke="var(--bg-tertiary)" strokeWidth="18" />
                
                {/* Travel Arc */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r={radius} 
                  fill="transparent" 
                  stroke="var(--sky)" 
                  strokeWidth="18" 
                  strokeDasharray={`${strokeTravel} ${circumference - strokeTravel}`} 
                  strokeDashoffset={-offsetTravel}
                  style={{ transition: 'stroke-dasharray 0.5s' }}
                />

                {/* Home Energy Arc */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r={radius} 
                  fill="transparent" 
                  stroke="var(--accent-primary)" 
                  strokeWidth="18" 
                  strokeDasharray={`${strokeHome} ${circumference - strokeHome}`} 
                  strokeDashoffset={-offsetHome}
                  style={{ transition: 'stroke-dasharray 0.5s' }}
                />

                {/* Diet Arc */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r={radius} 
                  fill="transparent" 
                  stroke="var(--mint)" 
                  strokeWidth="18" 
                  strokeDasharray={`${strokeDiet} ${circumference - strokeDiet}`} 
                  strokeDashoffset={-offsetDiet}
                  style={{ transition: 'stroke-dasharray 0.5s' }}
                />

                {/* Waste Arc */}
                <circle 
                  cx="70" 
                  cy="70" 
                  r={radius} 
                  fill="transparent" 
                  stroke="var(--coral)" 
                  strokeWidth="18" 
                  strokeDasharray={`${strokeWaste} ${circumference - strokeWaste}`} 
                  strokeDashoffset={-offsetWaste}
                  style={{ transition: 'stroke-dasharray 0.5s' }}
                />
              </svg>
              {/* Inner Text */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '50%', 
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center' 
                }}
              >
                <span style={{ fontSize: 'var(--font-2xl)', fontWeight: 800, display: 'block' }}>{tonnesTotal}</span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tonnes Total</span>
              </div>
            </div>
          </div>

          {/* Chart Legend */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)', fontSize: 'var(--font-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--sky)', display: 'inline-block' }} />
              <span>Travel: {Math.round(results.travel / 10)}% ({(results.travel/1000).toFixed(1)} t)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--accent-primary)', display: 'inline-block' }} />
              <span>Home: {Math.round(results.home / 10)}% ({(results.home/1000).toFixed(1)} t)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--mint)', display: 'inline-block' }} />
              <span>Diet: {Math.round(results.diet / 10)}% ({(results.diet/1000).toFixed(1)} t)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'var(--coral)', display: 'inline-block' }} />
              <span>Waste: {Math.round(results.waste / 10)}% ({(results.waste/1000).toFixed(1)} t)</span>
            </div>
          </div>
        </div>

        {/* Daily Habits Checklist Card */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckSquare size={20} className="text-emerald-500" style={{ color: 'var(--accent-primary)' }} />
              Daily Action Log
            </h3>
            <button 
              onClick={resetDailyHabits} 
              className="btn btn-secondary" 
              style={{ padding: '4px 8px', fontSize: 'var(--font-xs)' }}
            >
              Reset Checklist
            </button>
          </div>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
            Log daily green habits to earn Eco-Hero points and track physical daily carbon offsets.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-xs)' }}>
            {dailyHabits.map((habit) => (
              <div 
                key={habit.id} 
                onClick={() => handleHabitToggle(habit.id)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 'var(--spacing-md)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: habit.checked ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-tertiary)',
                  border: `1px solid ${habit.checked ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <input 
                  type="checkbox" 
                  checked={habit.checked} 
                  onChange={() => {}} // Controlled by outer click
                  style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ 
                    fontSize: 'var(--font-sm)', 
                    color: habit.checked ? 'var(--text-primary)' : 'var(--text-secondary)',
                    textDecoration: habit.checked ? 'line-through' : 'none'
                  }}>
                    {habit.text}
                  </span>
                  <span style={{ display: 'block', fontSize: '10px', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                    -{habit.co2} kg CO₂e saved today
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Habits reduction simulator slider area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="sim-header">
          <div>
            <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingDown size={22} style={{ color: 'var(--accent-primary)' }} />
              Dynamic Reduction Simulator
            </h3>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
              Simulate actions to instantly model your potential footprint reduction.
            </p>
          </div>
          {potentialSavings > 0 && (
            <div style={{ textAlign: 'right' }} className="sim-savings">
              <span className="badge badge-low" style={{ fontSize: 'var(--font-sm)', padding: '6px 12px' }}>
                -{tonnesSavings} t CO₂e / -{percentSaved}%
              </span>
            </div>
          )}
        </div>

        {/* Sliders Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-xl)', margin: 'var(--spacing-sm) 0' }} className="sim-sliders-grid">
          {/* Column 1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Reduce Car Commute</label>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 'bold', color: 'var(--sky)' }}>{carReduction}% less</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                style={{ width: '100%', accentColor: 'var(--sky)' }}
                value={carReduction}
                onChange={(e) => setCarReduction(Number(e.target.value))}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Substitute trips with remote work or cycling</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Reduce Flying</label>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 'bold', color: 'var(--sky)' }}>{flightReduction}% less</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                style={{ width: '100%', accentColor: 'var(--sky)' }}
                value={flightReduction}
                onChange={(e) => setFlightReduction(Number(e.target.value))}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Substitute flights with regional train travel</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Renewable Energy Share</label>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 'bold', color: 'var(--accent-primary)' }}>{energyRenewable}% green</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                style={{ width: '100%', accentColor: 'var(--accent-primary)' }}
                value={energyRenewable}
                onChange={(e) => setEnergyRenewable(Number(e.target.value))}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Switch utility tariff to solar, wind or biomass energy</span>
            </div>
          </div>

          {/* Column 2 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Reduce Meat Consumption</label>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 'bold', color: 'var(--mint)' }}>{meatReduction}% plant-based</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                style={{ width: '100%', accentColor: 'var(--mint)' }}
                value={meatReduction}
                onChange={(e) => setMeatReduction(Number(e.target.value))}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Shift diet to vegetarian days or vegan options</span>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <label className="form-label" style={{ margin: 0 }}>Increase Household Recycling</label>
                <span style={{ fontSize: 'var(--font-xs)', fontWeight: 'bold', color: 'var(--coral)' }}>{wasteRecycling}% recycled</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                style={{ width: '100%', accentColor: 'var(--coral)' }}
                value={wasteRecycling}
                onChange={(e) => setWasteRecycling(Number(e.target.value))}
              />
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Compost organic scrap and strictly segregate plastic/glass</span>
            </div>

            {/* Simulated Totals Display card inside slider panel */}
            <div 
              style={{ 
                backgroundColor: 'var(--bg-secondary)', 
                border: '1px solid var(--border-glass)', 
                borderRadius: 'var(--radius-md)', 
                padding: 'var(--spacing-md)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '10px'
              }}
            >
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block' }}>Simulated Footprint</span>
                <strong style={{ fontSize: 'var(--font-lg)', color: potentialSavings > 0 ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                  {tonnesSimulated} t CO₂e/yr
                </strong>
                {Number(tonnesSimulated) <= BENCHMARKS.parisGoal && (
                  <span className="badge badge-low" style={{ fontSize: '8px', display: 'inline-flex', marginTop: '4px', textTransform: 'none', backgroundColor: 'rgba(142, 171, 160, 0.15)' }}>
                    🌿 Paris Goal Reached!
                  </span>
                )}
                {Number(tonnesSimulated) > BENCHMARKS.parisGoal && Number(tonnesSimulated) < BENCHMARKS.globalAverage && (
                  <span className="badge badge-med" style={{ fontSize: '8px', display: 'inline-flex', marginTop: '4px', textTransform: 'none' }}>
                    📉 Under Global Average
                  </span>
                )}
              </div>
              {potentialSavings > 0 ? (
                <button 
                  onClick={onNavigateToRoadmap}
                  className="btn btn-primary"
                  style={{ padding: '8px 12px', fontSize: 'var(--font-xs)' }}
                >
                  Adopt in Action Plan
                </button>
              ) : (
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'right', maxWidth: '120px' }}>
                  Adjust sliders above to preview impact.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick fact card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', backgroundColor: 'var(--accent-glow)', padding: 'var(--spacing-md)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.15)' }}>
          <Lightbulb size={24} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
          <p style={{ fontSize: 'var(--font-sm)', margin: 0, color: 'var(--text-secondary)' }}>
            <strong>Insights:</strong> Based on your simulation, switching to 100% green energy and reducing meat intake by 50% represents the fastest way to drop your footprint close to the Paris climate threshold of 2 tonnes.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .dashboard-top-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-mid-grid {
            grid-template-columns: 1fr !important;
          }
          .sim-sliders-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-lg) !important;
          }
          .sim-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: var(--spacing-sm);
          }
          .sim-savings {
            text-align: left !important;
            width: 100%;
          }
          .benchmark-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-sm) !important;
          }
        }
      `}</style>
    </div>
  );
};

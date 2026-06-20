import React, { useState } from 'react';
import { CarbonInputs, defaultInputs } from '../utils/calculations';
import { ArrowRight, ArrowLeft, Check, Info, HelpCircle } from 'lucide-react';

interface CalculatorProps {
  onCalculate: (inputs: CarbonInputs) => void;
  savedInputs: CarbonInputs;
}

export const Calculator: React.FC<CalculatorProps> = ({ onCalculate, savedInputs }) => {
  const [step, setStep] = useState(0);
  const [inputs, setInputs] = useState<CarbonInputs>(savedInputs || defaultInputs);

  const handleNumberChange = (field: keyof CarbonInputs, value: string) => {
    const parsed = parseFloat(value);
    setInputs(prev => ({
      ...prev,
      [field]: isNaN(parsed) ? 0 : Math.max(0, parsed)
    }));
  };

  const handleSelectChange = (field: keyof CarbonInputs, value: string) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCalculate(inputs);
    setStep(4); // Results step
  };

  const stepsList = [
    { title: 'Intro', desc: 'Get Started' },
    { title: 'Travel', desc: 'Mobility Emissions' },
    { title: 'Energy', desc: 'Household Utilities' },
    { title: 'Lifestyle', desc: 'Diet & Waste' },
  ];

  return (
    <div className="fade-in" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Progress Stepper */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--spacing-xl)',
          position: 'relative',
        }}
        role="navigation"
        aria-label="Survey Progress"
      >
        {/* Stepper bar background */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '2px',
            backgroundColor: 'var(--bg-tertiary)',
            zIndex: 1,
          }}
        />
        {/* Active progress indicator */}
        <div 
          style={{
            position: 'absolute',
            top: '20px',
            left: '30px',
            right: '30px',
            height: '2px',
            backgroundColor: 'var(--accent-primary)',
            zIndex: 2,
            width: `${(step / 3) * 80}%`,
            maxWidth: '100%',
            transition: 'width var(--transition-speed) ease',
          }}
        />

        {stepsList.map((s, idx) => {
          const isCompleted = step > idx;
          const isActive = step === idx;
          return (
            <div 
              key={idx} 
              style={{
                zIndex: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1
              }}
            >
              <button
                type="button"
                onClick={() => idx <= step && setStep(idx)}
                disabled={idx > step && step === 4}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted 
                    ? 'var(--accent-primary)' 
                    : isActive 
                      ? 'var(--bg-secondary)' 
                      : 'var(--bg-tertiary)',
                  border: `2px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                  color: isCompleted ? '#0b0f19' : 'var(--text-primary)',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: idx <= step ? 'pointer' : 'not-allowed',
                  transition: 'all var(--transition-speed)',
                }}
                aria-label={`Step ${idx + 1}: ${s.title}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? <Check size={16} strokeWidth={3} /> : idx + 1}
              </button>
              <span 
                style={{
                  fontSize: 'var(--font-xs)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  marginTop: 'var(--spacing-sm)',
                  textAlign: 'center',
                }}
                className="desktop-only"
              >
                {s.title}
              </span>
            </div>
          );
        })}
      </div>

      <div className="glass-panel slide-up">
        {/* Step 0: Welcome / Instructions */}
        {step === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
            <h2 style={{ fontSize: 'var(--font-3xl)', marginBottom: 'var(--spacing-md)' }}>
              Discover Your Ecological Signature
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', maxWidth: '600px', margin: '0 auto var(--spacing-xl)' }}>
              It takes just 3 minutes to evaluate your carbon output. By answering a few quick questions about your commutes, energy bills, and eating habits, we will build a personalized roadmap to help you live more sustainably.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)' }} className="intro-grid">
              <div className="glass-panel" style={{ padding: 'var(--spacing-md)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🚗</span>
                <h3 style={{ fontSize: 'var(--font-md)', marginBottom: '4px' }}>1. Track</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Input transport, home utility, and meal data.</p>
              </div>
              <div className="glass-panel" style={{ padding: 'var(--spacing-md)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>📊</span>
                <h3 style={{ fontSize: 'var(--font-md)', marginBottom: '4px' }}>2. Simulate</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Adjust habits dynamically to model real-world reductions.</p>
              </div>
              <div className="glass-panel" style={{ padding: 'var(--spacing-md)' }}>
                <span style={{ fontSize: '24px', display: 'block', marginBottom: '8px' }}>🎯</span>
                <h3 style={{ fontSize: 'var(--font-md)', marginBottom: '4px' }}>3. Commit</h3>
                <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>Select actionable goals to offset and shrink your footprint.</p>
              </div>
            </div>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={nextStep}
              style={{ padding: '12px 28px' }}
            >
              Begin Calculator
              <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* Form Steps */}
        {step > 0 && step < 4 && (
          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
            {/* Step 1: Transport */}
            {step === 1 && (
              <div>
                <h2 style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--spacing-sm)' }}>🚗 Step 1: Transportation & Commute</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>How do you get around each year?</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="carFuelType">Annual Car Fuel Type</label>
                    <select
                      id="carFuelType"
                      className="form-select"
                      value={inputs.carFuelType}
                      onChange={(e) => handleSelectChange('carFuelType', e.target.value)}
                    >
                      <option value="petrol">Petrol (Gasoline)</option>
                      <option value="diesel">Diesel</option>
                      <option value="hybrid">Hybrid / Plug-in Hybrid</option>
                      <option value="electric">Electric (EV)</option>
                      <option value="none">No Car (Walk/Bike/Public Transit)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="carKm">
                      Annual Driving Mileage (km)
                    </label>
                    <input
                      id="carKm"
                      type="number"
                      className="form-input"
                      value={inputs.carKm === 0 ? '' : inputs.carKm}
                      onChange={(e) => handleNumberChange('carKm', e.target.value)}
                      placeholder="e.g. 10000"
                      disabled={inputs.carFuelType === 'none'}
                      min="0"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="flightsShort">
                      Short-Haul Flights (Total Hours/Year)
                      <span className="tooltip-container" style={{ marginLeft: '6px' }}>
                        <HelpCircle size={14} style={{ verticalAlign: 'middle' }} />
                        <span className="tooltip-text">Flights lasting less than 3 hours (e.g., regional or domestic).</span>
                      </span>
                    </label>
                    <input
                      id="flightsShort"
                      type="number"
                      className="form-input"
                      value={inputs.flightsShort === 0 ? '' : inputs.flightsShort}
                      onChange={(e) => handleNumberChange('flightsShort', e.target.value)}
                      placeholder="e.g. 4"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="flightsLong">
                      Long-Haul Flights (Total Hours/Year)
                      <span className="tooltip-container" style={{ marginLeft: '6px' }}>
                        <HelpCircle size={14} style={{ verticalAlign: 'middle' }} />
                        <span className="tooltip-text">Flights lasting longer than 3 hours (e.g., transcontinental or international).</span>
                      </span>
                    </label>
                    <input
                      id="flightsLong"
                      type="number"
                      className="form-input"
                      value={inputs.flightsLong === 0 ? '' : inputs.flightsLong}
                      onChange={(e) => handleNumberChange('flightsLong', e.target.value)}
                      placeholder="e.g. 12"
                      min="0"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="transitHours">
                    Public Transit Usage (Hours/Week)
                  </label>
                  <input
                    id="transitHours"
                    type="number"
                    className="form-input"
                    value={inputs.transitHours === 0 ? '' : inputs.transitHours}
                    onChange={(e) => handleNumberChange('transitHours', e.target.value)}
                    placeholder="Bus, train, tram hours per week (e.g. 5)"
                    min="0"
                  />
                </div>

                <div 
                  className="glass-panel" 
                  style={{ 
                    marginTop: 'var(--spacing-lg)', 
                    borderColor: 'rgba(56, 189, 248, 0.15)', 
                    display: 'flex', 
                    gap: 'var(--spacing-md)',
                    alignItems: 'center'
                  }}
                >
                  <Info size={24} style={{ color: 'var(--sky)', flexShrink: 0 }} />
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>Eco-Tip:</strong> Flying short distances is extremely carbon intensive per kilometer because plane takeoffs consume up to 25% of total trip fuel. Consider high-speed trains for journeys under 500 km.
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Energy */}
            {step === 2 && (
              <div>
                <h2 style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--spacing-sm)' }}>🔌 Step 2: Household Utilities & Energy</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>How is your home powered and heated?</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="electricityKwh">Average Monthly Electricity (kWh)</label>
                    <input
                      id="electricityKwh"
                      type="number"
                      className="form-input"
                      value={inputs.electricityKwh === 0 ? '' : inputs.electricityKwh}
                      onChange={(e) => handleNumberChange('electricityKwh', e.target.value)}
                      placeholder="Check utility bill (e.g. 250)"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="greenEnergyPercent">
                      Renewable Energy Share: {inputs.greenEnergyPercent}%
                    </label>
                    <input
                      id="greenEnergyPercent"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      style={{ width: '100%', accentColor: 'var(--accent-primary)', marginTop: '12px' }}
                      value={inputs.greenEnergyPercent}
                      onChange={(e) => handleNumberChange('greenEnergyPercent', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="heatingFuel">Primary Heating Source</label>
                    <select
                      id="heatingFuel"
                      className="form-select"
                      value={inputs.heatingFuel}
                      onChange={(e) => handleSelectChange('heatingFuel', e.target.value)}
                    >
                      <option value="natural-gas">Natural Gas</option>
                      <option value="lpg">LPG (Propane)</option>
                      <option value="heating-oil">Heating Oil</option>
                      <option value="wood">Wood Pellets / Biomass</option>
                      <option value="none">Electric Heat Pump / None</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="heatingKwh">
                      Monthly Heating Consumption (kWh equivalent)
                    </label>
                    <input
                      id="heatingKwh"
                      type="number"
                      className="form-input"
                      value={inputs.heatingKwh === 0 ? '' : inputs.heatingKwh}
                      onChange={(e) => handleNumberChange('heatingKwh', e.target.value)}
                      placeholder="e.g. 300"
                      disabled={inputs.heatingFuel === 'none'}
                      min="0"
                    />
                  </div>
                </div>

                <div 
                  className="glass-panel" 
                  style={{ 
                    marginTop: 'var(--spacing-lg)', 
                    borderColor: 'rgba(52, 211, 153, 0.15)', 
                    display: 'flex', 
                    gap: 'var(--spacing-md)',
                    alignItems: 'center'
                  }}
                >
                  <Info size={24} style={{ color: 'var(--mint)', flexShrink: 0 }} />
                  <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', margin: 0 }}>
                    <strong>Eco-Tip:</strong> Upgrading your utility plan to a green power option eliminates electricity grid emissions. Setting your green energy percentage to 100% will reduce your electric heating footprint to zero!
                  </p>
                </div>
              </div>
            )}

            {/* Step 3: Diet & Lifestyle */}
            {step === 3 && (
              <div>
                <h2 style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--spacing-sm)' }}>🥗 Step 3: Diet, Waste & Consumption</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)' }}>How do your food choices and buying habits look?</p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="dietType">Dietary Style</label>
                    <select
                      id="dietType"
                      className="form-select"
                      value={inputs.dietType}
                      onChange={(e) => handleSelectChange('dietType', e.target.value)}
                    >
                      <option value="heavy-meat">High Meat (Daily beef, lamb, pork)</option>
                      <option value="average-meat">Average Meat (Weekly beef/pork, regular poultry)</option>
                      <option value="low-meat">Low Meat (Mostly fish, poultry, minimal red meat)</option>
                      <option value="vegetarian">Vegetarian (No meat/fish, includes dairy/eggs)</option>
                      <option value="vegan">Vegan (100% plant-based, no animal products)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="localFoodPercent">
                      Locally Sourced Food: {inputs.localFoodPercent}%
                    </label>
                    <input
                      id="localFoodPercent"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      style={{ width: '100%', accentColor: 'var(--accent-primary)', marginTop: '12px' }}
                      value={inputs.localFoodPercent}
                      onChange={(e) => handleNumberChange('localFoodPercent', e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-lg)' }} className="form-grid">
                  <div className="form-group">
                    <label className="form-label" htmlFor="shoppingHabits">Consumer Shopping Profile</label>
                    <select
                      id="shoppingHabits"
                      className="form-select"
                      value={inputs.shoppingHabits}
                      onChange={(e) => handleSelectChange('shoppingHabits', e.target.value)}
                    >
                      <option value="heavy-consumer">Frequent shopper (Often buy new tech, clothes, goods)</option>
                      <option value="average-consumer">Average shopper (Occasional purchases, replace as needed)</option>
                      <option value="minimalist">Minimalist (Buy second-hand, reuse first, very few new items)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="wasteVolume">Household Trash Volume</label>
                    <select
                      id="wasteVolume"
                      className="form-select"
                      value={inputs.wasteVolume}
                      onChange={(e) => handleSelectChange('wasteVolume', e.target.value)}
                    >
                      <option value="high">High (Fill multiple big bins weekly)</option>
                      <option value="average">Average (Standard garbage bag output)</option>
                      <option value="low">Low (Very little trash, conscious packaging)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="recyclingRate">
                    Household Recycling Rate: {inputs.recyclingRate}%
                  </label>
                  <input
                    id="recyclingRate"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    style={{ width: '100%', accentColor: 'var(--accent-primary)', marginTop: '12px' }}
                    value={inputs.recyclingRate}
                    onChange={(e) => handleNumberChange('recyclingRate', e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div 
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 'var(--spacing-xl)',
                borderTop: '1px solid var(--border-glass)',
                paddingTop: 'var(--spacing-lg)',
              }}
            >
              <button
                type="button"
                className="btn btn-secondary"
                onClick={prevStep}
              >
                <ArrowLeft size={16} />
                Back
              </button>

              <button
                type="submit"
                className="btn btn-primary"
              >
                {step === 3 ? 'Generate Profile' : 'Continue'}
                <ArrowRight size={16} />
              </button>
            </div>
          </form>
        )}

        {/* Step 4: Calculator Complete / Redirection summary */}
        {step === 4 && (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-md)' }}>
            <div 
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--spacing-md)',
              }}
            >
              <Check size={32} strokeWidth={2.5} />
            </div>
            <h2 style={{ fontSize: 'var(--font-3xl)', marginBottom: 'var(--spacing-sm)' }}>
              Profile Compiled!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)', maxWidth: '500px', margin: '0 auto var(--spacing-xl)' }}>
              We have processed your transport, household utility, and lifestyle metrics. A custom data summary is ready for you in the Dashboard.
            </p>

            <div 
              style={{ 
                display: 'flex', 
                gap: 'var(--spacing-md)', 
                justifyContent: 'center',
                marginTop: 'var(--spacing-lg)' 
              }}
              className="intro-actions"
            >
              <button 
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
              >
                Recalculate
              </button>
              <button 
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  // The callback has already been fired
                  // We just need to prompt navigation in parent (which we do by switching tab to dashboard)
                  // Wait, how does Parent know? We will let App handle this.
                  // We can invoke onCalculate(inputs) which handles saving and setting tab.
                  onCalculate(inputs);
                }}
              >
                View Dashboard
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .form-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-md) !important;
          }
          .intro-grid {
            grid-template-columns: 1fr !important;
            gap: var(--spacing-md) !important;
          }
          .intro-actions {
            flex-direction: column !important;
            width: 100%;
          }
          .intro-actions button {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

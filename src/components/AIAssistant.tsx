import React, { useState, useEffect, useRef } from 'react';
import { CarbonInputs, CarbonResults } from '../utils/calculations';
import { Send, Bot, User, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';

interface AIAssistantProps {
  inputs: CarbonInputs;
  results: CarbonResults;
  points: number;
}

interface Message {
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ inputs, results, points }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputVal, setInputVal] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Compute key stats for contextual intelligence
  const tonnesTotal = (results.total / 1000).toFixed(1);
  const highestSector = () => {
    const sectors = [
      { name: 'travel', value: results.travel, label: 'Transportation' },
      { name: 'home', value: results.home, label: 'Home Energy' },
      { name: 'diet', value: results.diet, label: 'Diet & Nutrition' },
      { name: 'waste', value: results.waste, label: 'Waste & Shopping' },
    ];
    sectors.sort((a, b) => b.value - a.value);
    return sectors[0];
  };

  const highest = highestSector();

  // Load initial welcome message based on user context
  useEffect(() => {
    const welcomeText = `Hello! I am your **EcoSync Assistant**, a smart coach connected to your active carbon profile. 

I've analyzed your details: your annual footprint is **${tonnesTotal} tonnes of CO₂e**. 

Your highest emission area is **${highest.label}** (${(highest.value / 1000).toFixed(1)} tonnes, making up ${Math.round((highest.value / results.total) * 100)}% of your profile). 

How would you like to proceed? You can click one of the quick options below or ask me a custom question about lowering your carbon output!`;

    setMessages([
      {
        sender: 'assistant',
        text: welcomeText,
        timestamp: new Date()
      }
    ]);
  }, [inputs, results]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg: Message = {
      sender: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');

    // Generate smart assistant response based on user context and keywords
    setTimeout(() => {
      const assistantResponse = generateBotResponse(text.toLowerCase());
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: assistantResponse,
        timestamp: new Date()
      }]);
    }, 600);
  };

  // Rule-based NLP reasoning engine utilizing user context
  const generateBotResponse = (query: string): string => {
    // 1. Travel query
    if (query.includes('travel') || query.includes('car') || query.includes('flight') || query.includes('transit') || query.includes('transport')) {
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
    if (query.includes('energy') || query.includes('electricity') || query.includes('power') || query.includes('heating') || query.includes('solar') || query.includes('gas')) {
      let advice = `Your home energy footprint is **${(results.home / 1000).toFixed(1)} tonnes CO₂e/yr**. `;

      if (inputs.greenEnergyPercent < 100) {
        advice += `\n\n- **Green Tariff**: Your current renewable share is only **${inputs.greenEnergyPercent}%**. Upgrading to a 100% green energy tariff with your grid provider will eliminate up to **${Math.round(inputs.electricityKwh * 12 * 0.38 * (1 - inputs.greenEnergyPercent/100))} kg CO₂e** from your annual electric utility footprint!`;
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
    if (query.includes('diet') || query.includes('food') || query.includes('meat') || query.includes('vegan') || query.includes('vegetarian')) {
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
    if (query.includes('waste') || query.includes('recycle') || query.includes('trash') || query.includes('shopping') || query.includes('plastic') || query.includes('thrift')) {
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
    if (query.includes('highest') || query.includes('source') || query.includes('worst') || query.includes('main')) {
      return `Your absolute highest emission source is **${highest.label}** which generates **${(highest.value / 1000).toFixed(1)} tonnes CO₂e/yr** (${Math.round((highest.value / results.total) * 100)}% of your footprint). 

I highly recommend visiting the **Green Roadmap** tab to commit to the specific actions listed under the **${highest.name}** filter! Resolving this sector first will yield your fastest path to a net-zero footprint.`;
    }

    // 6. Action plan query
    if (query.includes('plan') || query.includes('action') || query.includes('roadmap') || query.includes('step')) {
      return `Here is a custom **3-Step Action Plan** curated for your current profile:

1. **Focus on ${highest.label}**: Tackle your highest emitter first by navigating to the **Green Roadmap** catalog.
2. **Upgrade to 100% Green Energy**: In the simulator, check the effect of green power. Swapping your home utility tariff represents a huge emission cut with zero daily friction.
3. **Earn Eco-Hero points**: Tick off daily checklist habits on the **Dashboard** (like washing laundry cold or going meat-free) to gamify your path and build lasting habits.`;
    }

    // 7. Points/Rank query
    if (query.includes('point') || query.includes('score') || query.includes('rank') || query.includes('hero') || query.includes('badge')) {
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
  };

  const quickQuestions = [
    { text: 'How do I reduce my travel footprint?', short: 'travel' },
    { text: 'What is my highest emission source?', short: 'highest' },
    { text: 'Give me a 3-step action plan.', short: 'plan' },
    { text: 'How do I earn more points?', short: 'points' },
  ];

  return (
    <div className="fade-in assistant-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--spacing-xl)' }}>
      {/* Active Chat Window */}
      <div 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          height: '520px',
          justifyContent: 'space-between',
          padding: 'var(--spacing-md)'
        }}
      >
        {/* Chat Messages Log */}
        <div 
          style={{ 
            flex: 1, 
            overflowY: 'auto', 
            paddingRight: '4px',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            marginBottom: 'var(--spacing-md)'
          }}
        >
          {messages.map((msg, idx) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div 
                key={idx} 
                style={{ 
                  display: 'flex', 
                  gap: 'var(--spacing-sm)', 
                  alignItems: 'flex-start',
                  alignSelf: isBot ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {isBot && (
                  <div 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--accent-primary)',
                      flexShrink: 0
                    }}
                  >
                    <Bot size={16} />
                  </div>
                )}
                
                <div 
                  style={{
                    backgroundColor: isBot ? 'var(--bg-tertiary)' : 'var(--accent-primary)',
                    color: isBot ? 'var(--text-primary)' : 'var(--bg-primary)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    fontSize: 'var(--font-sm)',
                    lineHeight: 1.5,
                    border: isBot ? '1px solid var(--border-glass)' : 'none',
                    whiteSpace: 'pre-line' // respects double line breaks
                  }}
                  className="msg-bubble"
                >
                  {/* Simplistic bolding parser for display */}
                  {msg.text.split('**').map((chunk, cIdx) => 
                    cIdx % 2 === 1 ? <strong key={cIdx} style={{ color: isBot ? 'var(--accent-primary)' : 'inherit' }}>{chunk}</strong> : chunk
                  )}
                </div>

                {!isBot && (
                  <div 
                    style={{ 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '50%', 
                      backgroundColor: 'var(--accent-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--bg-primary)',
                      flexShrink: 0
                    }}
                  >
                    <User size={16} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input Bar and Controls */}
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputVal); }}
          style={{ 
            display: 'flex', 
            gap: 'var(--spacing-sm)', 
            borderTop: '1px solid var(--border-glass)', 
            paddingTop: 'var(--spacing-md)' 
          }}
        >
          <input
            type="text"
            className="form-input"
            placeholder="Ask me a question about your carbon footprint..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            style={{ flex: 1, padding: '10px 12px' }}
          />
          <button 
            type="submit" 
            className="btn btn-primary"
            style={{ padding: '10px 14px' }}
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Right Column: Profile Context and Quick Prompts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* Profile Context Drawer */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} style={{ color: 'var(--accent-primary)' }} />
            Active Intelligent Context
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
            The assistant has loaded your calculations data to make reasoning decisions:
          </p>
          
          <div style={{ fontSize: 'var(--font-xs)', display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'var(--spacing-xs)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Total Emissions:</span>
              <strong>{tonnesTotal} tonnes CO₂e/yr</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Highest Source:</span>
              <strong style={{ color: 'var(--coral)' }}>{highest.label}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Car Fuel Type:</span>
              <span style={{ textTransform: 'capitalize' }}>{inputs.carFuelType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Electricity Renewable:</span>
              <span>{inputs.greenEnergyPercent}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '4px' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Diet Profile:</span>
              <span style={{ textTransform: 'capitalize' }}>{inputs.dietType}</span>
            </div>
          </div>
        </div>

        {/* Quick Questions suggestions */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
          <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={18} style={{ color: 'var(--sky)' }} />
            Suggested Prompts
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
            Click a suggestion to query the EcoSync assistant instantly:
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.short)}
                className="btn btn-secondary"
                style={{ 
                  textAlign: 'left', 
                  justifyContent: 'space-between', 
                  padding: '8px 12px',
                  fontSize: 'var(--font-xs)'
                }}
              >
                <span>{q.text}</span>
                <ArrowRight size={12} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .assistant-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';
import { CarbonInputs, CarbonResults } from '../utils/calculations';
import { Send, Bot, User, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { generateBotResponse } from '../utils/aiReasoning';

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
      const assistantResponse = generateBotResponse(text.toLowerCase(), inputs, results, points, highest);
      setMessages(prev => [...prev, {
        sender: 'assistant',
        text: assistantResponse,
        timestamp: new Date()
      }]);
    }, 600);
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
            id="chat-input"
            type="text"
            className="form-input"
            placeholder="Ask me a question about your carbon footprint..."
            aria-label="Query the Eco-Coach assistant"
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

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
    <div className="fade-in assistant-grid">
      {/* Active Chat Window */}
      <div className="glass-panel chat-panel">
        {/* Chat Messages Log */}
        <div className="chat-messages-log">
          {messages.map((msg, idx) => {
            const isBot = msg.sender === 'assistant';
            return (
              <div 
                key={idx} 
                className={`msg-wrapper ${isBot ? 'msg-bot' : 'msg-user'}`}
              >
                {isBot && (
                  <div className="avatar-bot">
                    <Bot size={16} />
                  </div>
                )}
                
                <div 
                  className={`msg-bubble ${isBot ? 'msg-bubble-bot' : 'msg-bubble-user'}`}
                >
                  {/* Simplistic bolding parser for display */}
                  {msg.text.split('**').map((chunk, cIdx) => 
                    cIdx % 2 === 1 ? <strong key={cIdx} className={isBot ? "assistant-bold-text-bot" : ""}>{chunk}</strong> : chunk
                  )}
                </div>

                {!isBot && (
                  <div className="avatar-user">
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
          className="chat-input-form"
        >
          <input
            id="chat-input"
            type="text"
            className="form-input chat-input-field"
            placeholder="Ask me a question about your carbon footprint..."
            aria-label="Query the Eco-Coach assistant"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button 
            type="submit" 
            className="btn btn-primary chat-send-btn"
            aria-label="Send message"
          >
            <Send size={16} />
          </button>
        </form>
      </div>

      {/* Right Column: Profile Context and Quick Prompts */}
      <div className="sidebar-col">
        {/* Profile Context Drawer */}
        <div className="glass-panel profile-context-drawer">
          <h3 className="ai-sidebar-header">
            <Sparkles size={18} className="text-accent-primary" />
            Active Intelligent Context
          </h3>
          <p className="ai-sidebar-desc">
            The assistant has loaded your calculations data to make reasoning decisions:
          </p>
          
          <div className="context-list">
            <div className="context-item">
              <span className="text-secondary-color">Total Emissions:</span>
              <strong>{tonnesTotal} tonnes CO₂e/yr</strong>
            </div>
            <div className="context-item">
              <span className="text-secondary-color">Highest Source:</span>
              <strong className="text-coral">{highest.label}</strong>
            </div>
            <div className="context-item">
              <span className="text-secondary-color">Car Fuel Type:</span>
              <span className="text-capitalize">{inputs.carFuelType}</span>
            </div>
            <div className="context-item">
              <span className="text-secondary-color">Electricity Renewable:</span>
              <span>{inputs.greenEnergyPercent}%</span>
            </div>
            <div className="context-item">
              <span className="text-secondary-color">Diet Profile:</span>
              <span className="text-capitalize">{inputs.dietType}</span>
            </div>
          </div>
        </div>

        {/* Quick Questions suggestions */}
        <div className="glass-panel suggested-prompts-drawer">
          <h3 className="ai-sidebar-header">
            <HelpCircle size={18} className="text-sky" />
            Suggested Prompts
          </h3>
          <p className="suggested-prompts-desc">
            Click a suggestion to query the EcoSync assistant instantly:
          </p>

          <div className="suggested-prompts-list">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q.short)}
                className="btn btn-secondary suggested-prompt-btn"
              >
                <span>{q.text}</span>
                <ArrowRight size={12} className="suggested-prompt-icon" />
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

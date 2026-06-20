import React, { useState } from 'react';
import { HelpCircle, RefreshCw, Award, CheckCircle, XCircle, Info, GraduationCap } from 'lucide-react';

interface EcoHubProps {
  onPointsEarned: (pts: number) => void;
}

interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    q: "Which food option carries the highest greenhouse gas footprint per kilogram of product?",
    options: ["Cheese", "Pork", "Beef", "Tofu"],
    correct: 2,
    explanation: "Beef produces roughly 60 kg of CO2e per kg of food—more than double cheese and ten times pork. This is primarily due to enteric fermentation (methane from cattle digestion) and feed pasture deforestation."
  },
  {
    q: "What percentage of global greenhouse gas emissions is estimated to come from agriculture and food systems?",
    options: ["Approx. 5%", "Approx. 12%", "Approx. 26%", "Approx. 50%"],
    correct: 2,
    explanation: "Food systems account for around 26% of global greenhouse gas emissions. This includes land clearing, crop cultivation, livestock farming, transport, packaging, and rotting food waste in landfills."
  },
  {
    q: "True or False: Leaving phone chargers and electronics plugged in when not in use draws zero electricity.",
    options: ["True", "False"],
    correct: 1,
    explanation: "False. This is known as 'vampire draw' or standby load. Connected appliances and chargers draw tiny currents continuously, accounting for up to 10% of average household electricity bills worldwide."
  },
  {
    q: "Which transport medium typically has the lowest emissions per passenger-kilometer?",
    options: ["Electric SUV", "Diesel Passenger Bus", "Intercity Train", "Domestic Air Flight"],
    correct: 2,
    explanation: "Intercity rail transport is highly efficient and operates on dedicated grids. It emits up to 85% less CO2e per passenger-km than solo driving or regional short-haul flights."
  },
  {
    q: "Roughly what proportion of human-caused CO2 emissions is absorbed by Earth's natural sinks (oceans and forests)?",
    options: ["About 10%", "About 25%", "About 50%", "About 85%"],
    correct: 2,
    explanation: "Earth's natural systems—primarily marine phytoplankton, soils, and land forests—absorb roughly 50% of our annual CO2 emissions. The remaining 50% accumulates in the atmosphere, driving climate change."
  }
];

const ECO_FACTS = [
  {
    id: 1,
    title: "The Aviation Burden",
    content: "A single round-trip flight from London to New York releases about 1.6 tonnes of CO2e per passenger. That is more than the entire annual carbon footprint of an average citizen in over 50 developing nations."
  },
  {
    id: 2,
    title: "Water Warming Costs",
    content: "Setting your washing machine cycle to 30°C instead of 40°C or 60°C uses up to 60% less electricity. Most washing energy goes solely toward heating the water, not tumbling the clothes."
  },
  {
    id: 3,
    title: "Dietary Levers",
    content: "Shifting from a heavy meat diet to a vegan diet reduces food emissions by up to 60%. This shift represents the single most effective individual action to reduce daily land-use and agricultural carbon pressure."
  },
  {
    id: 4,
    title: "Textile Footprint",
    content: "Manufacturing a single brand-new cotton t-shirt generates approximately 7 kg of CO2e and requires 2,700 liters of water—enough drinking water for one person for 2.5 years. Buying second-hand directly offsets this."
  },
  {
    id: 5,
    title: "Vampire Electronics",
    content: "Worldwide, vampire power draw from unused, plugged-in devices is estimated to be responsible for 1% of global greenhouse emissions—almost equivalent to the total emissions of the entire commercial aviation sector."
  }
];

export const EcoHub: React.FC<EcoHubProps> = ({ onPointsEarned }) => {
  // Fact index state
  const [factIndex, setFactIndex] = useState(0);

  // Quiz states
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handleNextFact = () => {
    setFactIndex(prev => (prev + 1) % ECO_FACTS.length);
  };

  const handleAnswerSelect = (optIndex: number) => {
    if (isAnswered) return;
    setSelectedOpt(optIndex);
  };

  const handleConfirmAnswer = () => {
    if (selectedOpt === null || isAnswered) return;
    
    const correct = QUIZ_QUESTIONS[currentQ].correct;
    if (selectedOpt === correct) {
      setScore(s => s + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    setSelectedOpt(null);
    setIsAnswered(false);
    
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(prev => prev + 1);
    } else {
      setQuizFinished(true);
      // Give points to user: 10 pts per correct answer, 50 pts bonus if 5/5
      const basePoints = score * 10;
      const bonus = score === QUIZ_QUESTIONS.length ? 50 : 0;
      onPointsEarned(basePoints + bonus);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQ(0);
    setSelectedOpt(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  const activeFact = ECO_FACTS[factIndex];
  const qObj = QUIZ_QUESTIONS[currentQ];

  return (
    <div className="fade-in hub-grid" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 'var(--spacing-xl)' }}>
      {/* Quiz Area */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
        <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HelpCircle size={22} style={{ color: 'var(--accent-primary)' }} />
          Environmental Awareness Quiz
        </h3>
        <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)' }}>
          Test your eco-literacy, learn crucial facts, and earn points toward your Eco-Hero rank.
        </p>

        <hr style={{ border: 0, borderTop: '1px solid var(--border-glass)' }} />

        {!quizStarted ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: 'var(--spacing-md)' }}>🧠</span>
            <h4 style={{ fontSize: 'var(--font-lg)', marginBottom: 'var(--spacing-sm)' }}>Ready to test your knowledge?</h4>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '400px', margin: '0 auto var(--spacing-lg)' }}>
              A short 5-question trivia game about climate metrics, energy savings, and diet calculations.
            </p>
            <button 
              className="btn btn-primary" 
              onClick={() => setQuizStarted(true)}
              style={{ padding: '10px 24px' }}
            >
              Start Trivia Quiz
            </button>
          </div>
        ) : quizFinished ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl) 0' }}>
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
                margin: '0 auto var(--spacing-md)'
              }}
            >
              <Award size={32} />
            </div>
            <h4 style={{ fontSize: 'var(--font-2xl)', marginBottom: 'var(--spacing-sm)' }}>Quiz Complete!</h4>
            <p style={{ fontSize: 'var(--font-md)', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: 'var(--spacing-sm)' }}>
              Score: {score} / {QUIZ_QUESTIONS.length} Correct
            </p>
            <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '350px', margin: '0 auto var(--spacing-lg)' }}>
              {score === 5 
                ? "Perfect! You earned +100 Eco-Hero points (including a 50pt bonus)!" 
                : `Nice job! You earned +${score * 10} Eco-Hero points for your correct answers.`}
            </p>
            <button className="btn btn-secondary" onClick={resetQuiz}>
              Play Again
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
            {/* Question header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
              <span>Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
              <span>Score: {score}</span>
            </div>

            {/* Progress bar */}
            <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '2px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${((currentQ) / QUIZ_QUESTIONS.length) * 100}%`, 
                  height: '100%', 
                  backgroundColor: 'var(--accent-primary)',
                  transition: 'width 0.3s'
                }} 
              />
            </div>

            <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 600, lineHeight: 1.4, margin: 'var(--spacing-sm) 0' }}>
              {qObj.q}
            </h4>

            {/* Options list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {qObj.options.map((opt, oIdx) => {
                const isSelected = selectedOpt === oIdx;
                const isCorrect = qObj.correct === oIdx;
                
                let bgColor = 'var(--bg-tertiary)';
                let borderColor = 'var(--border-glass)';
                
                if (isAnswered) {
                  if (isCorrect) {
                    bgColor = 'rgba(16, 185, 129, 0.1)';
                    borderColor = 'var(--accent-primary)';
                  } else if (isSelected) {
                    bgColor = 'rgba(248, 113, 113, 0.1)';
                    borderColor = 'var(--coral)';
                  }
                } else if (isSelected) {
                  bgColor = 'var(--bg-secondary)';
                  borderColor = 'var(--sky)';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => handleAnswerSelect(oIdx)}
                    disabled={isAnswered}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--spacing-md)',
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: bgColor,
                      border: `1px solid ${borderColor}`,
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: isAnswered ? 'not-allowed' : 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                      fontFamily: 'var(--font-body)',
                      fontSize: 'var(--font-sm)'
                    }}
                  >
                    <span 
                      style={{ 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        backgroundColor: isSelected ? 'var(--sky)' : 'var(--bg-primary)',
                        color: isSelected ? '#0b0f19' : 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        flexShrink: 0
                      }}
                    >
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span style={{ flex: 1 }}>{opt}</span>
                    
                    {isAnswered && isCorrect && (
                      <CheckCircle size={18} style={{ color: 'var(--accent-primary)' }} />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={18} style={{ color: 'var(--coral)' }} />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Answer feedback */}
            {isAnswered && (
              <div 
                className="glass-panel" 
                style={{ 
                  marginTop: 'var(--spacing-md)', 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderColor: 'rgba(16, 185, 129, 0.15)',
                  display: 'flex',
                  gap: 'var(--spacing-md)',
                  alignItems: 'flex-start'
                }}
              >
                <Info size={20} style={{ color: 'var(--accent-primary)', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ fontSize: 'var(--font-xs)', color: 'var(--accent-primary)', display: 'block', textTransform: 'uppercase', marginBottom: '2px' }}>
                    {selectedOpt === qObj.correct ? "Correct Choice" : "Incorrect Choice"}
                  </strong>
                  <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', margin: 0 }}>
                    {qObj.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--spacing-md)' }}>
              {!isAnswered ? (
                <button 
                  className="btn btn-primary" 
                  disabled={selectedOpt === null}
                  onClick={handleConfirmAnswer}
                >
                  Submit Answer
                </button>
              ) : (
                <button className="btn btn-primary" onClick={handleNextQuestion}>
                  {currentQ === QUIZ_QUESTIONS.length - 1 ? "Finish Quiz" : "Next Question"}
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Facts rotational Drawer */}
      <div 
        className="glass-panel" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between', 
          background: 'linear-gradient(135deg, var(--bg-glass), rgba(16, 185, 129, 0.05))',
          minHeight: '280px'
        }}
      >
        <div>
          <h3 style={{ fontSize: 'var(--font-xl)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--spacing-sm)' }}>
            <GraduationCap size={22} style={{ color: 'var(--mint)' }} />
            Eco-Facts Library
          </h3>
          <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
            Fast environmental metrics to help guide your carbon reduction journey.
          </p>

          {/* Fact card with rotational fade */}
          <div key={activeFact.id} className="fade-in" style={{ margin: 'var(--spacing-md) 0' }}>
            <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700, color: 'var(--mint)', marginBottom: '6px' }}>
              {activeFact.title}
            </h4>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)', lineHeight: 1.5 }}>
              {activeFact.content}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: 'var(--spacing-md)' }}>
          <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            Fact {factIndex + 1} of {ECO_FACTS.length}
          </span>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '6px 12px', fontSize: 'var(--font-xs)' }}
            onClick={handleNextFact}
          >
            <RefreshCw size={12} />
            Next Fact
          </button>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hub-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

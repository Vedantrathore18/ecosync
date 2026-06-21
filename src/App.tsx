import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Calculator } from './components/Calculator';
import { Dashboard } from './components/Dashboard';
import { ActionRoadmap } from './components/ActionRoadmap';
import { EcoHub } from './components/EcoHub';
import { AIAssistant } from './components/AIAssistant';
import { CarbonInputs, CarbonResults, calculateCarbonFootprint, defaultInputs } from './utils/calculations';
import { Sparkles, Trophy } from 'lucide-react';
import './styles/global.css';

export const App: React.FC = () => {
  // Load inputs from localStorage or use default
  const [inputs, setInputs] = useState<CarbonInputs>(() => {
    const saved = localStorage.getItem('eco-inputs');
    return saved ? JSON.parse(saved) : defaultInputs;
  });

  // Calculate results on load
  const [results, setResults] = useState<CarbonResults>(() => {
    return calculateCarbonFootprint(inputs);
  });

  // Check if user has completed calculator at least once
  const [hasCompletedCalc, setHasCompletedCalc] = useState<boolean>(() => {
    return localStorage.getItem('eco-inputs-completed') === 'true';
  });

  // Active tab state
  const [activeTab, setActiveTab] = useState<string>(() => {
    const completed = localStorage.getItem('eco-inputs-completed') === 'true';
    return completed ? 'dashboard' : 'calculator';
  });

  // Points and streak state (shared)
  const [points, setPoints] = useState<number>(() => {
    return Number(localStorage.getItem('eco-user-points')) || 0;
  });

  const [streak, setStreak] = useState<number>(() => {
    return Number(localStorage.getItem('eco-user-streak')) || 0;
  });

  const [notification, setNotification] = useState<{ show: boolean; msg: string; type: 'points' | 'info' }>({
    show: false,
    msg: '',
    type: 'points'
  });

  const handlePointsEarned = (pts: number) => {
    setPoints(prev => {
      const newVal = Math.max(0, prev + pts);
      localStorage.setItem('eco-user-points', newVal.toString());
      return newVal;
    });

    if (pts > 0) {
      // Show points notification popup
      setNotification({
        show: true,
        msg: `+${pts} Eco-Hero Points Earned!`,
        type: 'points'
      });

      setTimeout(() => {
        setNotification(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleStreakIncrement = () => {
    setStreak(prev => {
      const newVal = prev + 1;
      localStorage.setItem('eco-user-streak', newVal.toString());
      return newVal;
    });
  };

  const handleCalculate = (newInputs: CarbonInputs) => {
    setInputs(newInputs);
    const newResults = calculateCarbonFootprint(newInputs);
    setResults(newResults);
    setHasCompletedCalc(true);
    localStorage.setItem('eco-inputs', JSON.stringify(newInputs));
    localStorage.setItem('eco-inputs-completed', 'true');
    setActiveTab('dashboard');

    setNotification({
      show: true,
      msg: "Carbon profile calculated successfully!",
      type: 'info'
    });

    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Synchronize points to localStorage on state changes
  useEffect(() => {
    localStorage.setItem('eco-user-points', points.toString());
    localStorage.setItem('eco-user-streak', streak.toString());
  }, [points, streak]);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {/* Toast Notification */}
      {notification.show && (
        <div 
          className="glass-panel slide-up"
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '24px',
            zIndex: 999,
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-md)',
            backgroundColor: notification.type === 'points' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            borderColor: notification.type === 'points' ? 'var(--gold)' : 'var(--accent-primary)',
            boxShadow: '0 8px 30px rgba(0, 0, 0, 0.3)',
          }}
        >
          {notification.type === 'points' ? (
            <Trophy size={20} style={{ color: 'var(--gold)' }} />
          ) : (
            <Sparkles size={20} style={{ color: 'var(--accent-primary)' }} />
          )}
          <strong style={{ fontSize: 'var(--font-sm)', color: 'var(--text-primary)' }}>
            {notification.msg}
          </strong>
        </div>
      )}

      {/* View routing */}
      {activeTab === 'calculator' && (
        <Calculator 
          savedInputs={inputs} 
          onCalculate={handleCalculate} 
        />
      )}

      {activeTab === 'dashboard' && (
        hasCompletedCalc ? (
          <Dashboard 
            results={results} 
            inputs={inputs} 
            points={points}
            streak={streak}
            onPointsEarned={handlePointsEarned}
            onStreakIncrement={handleStreakIncrement}
            onNavigateToRoadmap={() => setActiveTab('roadmap')} 
          />
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: 'var(--spacing-xxl) 0' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: 'var(--spacing-md)' }}>📊</span>
            <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--spacing-sm)' }}>No Carbon Profile Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '400px', margin: '0 auto var(--spacing-lg)' }}>
              Please calculate your carbon footprint first to unlock the analytics dashboard.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('calculator')}>
              Open Calculator
            </button>
          </div>
        )
      )}

      {activeTab === 'roadmap' && (
        <ActionRoadmap onPointsEarned={handlePointsEarned} />
      )}

      {activeTab === 'assistant' && (
        hasCompletedCalc ? (
          <AIAssistant inputs={inputs} results={results} points={points} />
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: 'var(--spacing-xxl) 0' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: 'var(--spacing-md)' }}>🤖</span>
            <h3 style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--spacing-sm)' }}>No Carbon Profile Found</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--spacing-lg)', maxWidth: '400px', margin: '0 auto var(--spacing-lg)' }}>
              Please calculate your carbon footprint first to unlock your personalized AI Eco Assistant.
            </p>
            <button className="btn btn-primary" onClick={() => setActiveTab('calculator')}>
              Open Calculator
            </button>
          </div>
        )
      )}

      {activeTab === 'hub' && (
        <EcoHub onPointsEarned={handlePointsEarned} />
      )}
    </Layout>
  );
};
export default App;

import React, { useState, useEffect } from 'react';
import { ECO_ACTIONS } from '../utils/actionData';
import { Bookmark, Check, Trash2, Filter, Sparkles } from 'lucide-react';

interface ActionRoadmapProps {
  onPointsEarned: (pts: number) => void;
}

export const ActionRoadmap: React.FC<ActionRoadmapProps> = ({ onPointsEarned }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeEffort, setActiveEffort] = useState<string>('all');
  const [activeImpact, setActiveImpact] = useState<string>('all');

  // Committed actions (saved in localStorage)
  const [committedIds, setCommittedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco-committed-actions');
    return saved ? JSON.parse(saved) : [];
  });

  // Completed actions (saved in localStorage)
  const [completedIds, setCompletedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('eco-completed-actions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('eco-committed-actions', JSON.stringify(committedIds));
  }, [committedIds]);

  useEffect(() => {
    localStorage.setItem('eco-completed-actions', JSON.stringify(completedIds));
  }, [completedIds]);

  // Action logic
  const handleCommit = (id: string) => {
    if (!committedIds.includes(id)) {
      setCommittedIds(prev => [...prev, id]);
      onPointsEarned(10); // small incentive
    }
  };

  const handleUncommit = (id: string) => {
    setCommittedIds(prev => prev.filter(x => x !== id));
  };

  const handleComplete = (id: string) => {
    // Add to completed, remove from active committed
    if (!completedIds.includes(id)) {
      setCompletedIds(prev => [...prev, id]);
      setCommittedIds(prev => prev.filter(x => x !== id));
      
      const action = ECO_ACTIONS.find(a => a.id === id);
      const pointsReward = action ? (action.impact === 'high' ? 100 : action.impact === 'medium' ? 60 : 30) : 30;
      onPointsEarned(pointsReward);
    }
  };

  const handleUndoComplete = (id: string) => {
    setCompletedIds(prev => prev.filter(x => x !== id));
    setCommittedIds(prev => [...prev, id]);
  };

  // Filter actions
  const filteredActions = ECO_ACTIONS.filter(action => {
    const matchCat = activeCategory === 'all' || action.category === activeCategory;
    const matchEff = activeEffort === 'all' || action.effort === activeEffort;
    const matchImp = activeImpact === 'all' || action.impact === activeImpact;
    // Hide completed actions from the catalog
    const isCompleted = completedIds.includes(action.id);
    return matchCat && matchEff && matchImp && !isCompleted;
  });

  // Calculations for active savings
  const activeCommittedActions = ECO_ACTIONS.filter(a => committedIds.includes(a.id));
  const activeSavings = activeCommittedActions.reduce((sum, a) => sum + a.savings, 0);

  const completedActions = ECO_ACTIONS.filter(a => completedIds.includes(a.id));
  const completedSavings = completedActions.reduce((sum, a) => sum + a.savings, 0);

  const getCategoryEmoji = (cat: string) => {
    switch(cat) {
      case 'home': return '🏠';
      case 'travel': return '🚗';
      case 'diet': return '🥗';
      case 'waste': return '🗑️';
      default: return '🌱';
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xl)' }}>
      {/* Overview Dashboard for Active Roadmaps */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 'var(--spacing-lg)' }} className="roadmap-top-grid">
        {/* Active commitments status */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{ fontSize: 'var(--font-xl)', marginBottom: 'var(--spacing-xs)' }}>Your Carbon Reduction Roadmap</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-sm)' }}>
              Track active goals you have committed to and log your long-term reductions.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-lg)' }}>
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', display: 'block' }}>Active Committed Savings</span>
              <strong style={{ fontSize: 'var(--font-xl)', color: 'var(--sky)' }}>{activeSavings} kg CO₂e/yr</strong>
              <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {activeCommittedActions.length} actions in progress
              </span>
            </div>
            <div style={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: 'var(--radius-md)', padding: 'var(--spacing-md)', textAlign: 'center' }}>
              <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', display: 'block' }}>Permanent Reductions Achieved</span>
              <strong style={{ fontSize: 'var(--font-xl)', color: 'var(--accent-primary)' }}>{completedSavings} kg CO₂e/yr</strong>
              <span style={{ display: 'block', fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px' }}>
                {completedActions.length} goals locked in
              </span>
            </div>
          </div>
        </div>

        {/* Tree-Planting Metaphor Card */}
        <div className="glass-panel" style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
          <div 
            style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              flexShrink: 0
            }}
          >
            🌳
          </div>
          <div>
            <h3 style={{ fontSize: 'var(--font-md)', fontWeight: 700 }}>Forest Equivalence</h3>
            <p style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Your completed reductions ({completedSavings} kg) offsets carbon equivalent to growing <strong>{Math.max(1, Math.round(completedSavings / 22))}</strong> mature urban trees for a year!
            </p>
            <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>*Based on EPA tree-absorption averages (22kg per tree/year)</span>
          </div>
        </div>
      </div>

      {/* Two Columns: Active Commitments vs. Action Marketplace */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 'var(--spacing-lg)' }} className="roadmap-mid-grid">
        {/* Left Column: Active committed tasks list */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', height: 'fit-content' }}>
          <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bookmark size={18} style={{ color: 'var(--sky)' }} />
            Active Green Tasks ({activeCommittedActions.length})
          </h3>

          {activeCommittedActions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: 'var(--font-sm)', marginBottom: 'var(--spacing-md)' }}>No active commitments yet.</p>
              <p style={{ fontSize: '11px' }}>Explore the catalog on the right and select actions to add them to your roadmap!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
              {activeCommittedActions.map(action => (
                <div 
                  key={action.id} 
                  className="glass-panel" 
                  style={{ 
                    padding: 'var(--spacing-md)', 
                    backgroundColor: 'var(--bg-secondary)',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 'var(--spacing-sm)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <span style={{ fontSize: '18px', marginRight: '6px' }}>{getCategoryEmoji(action.category)}</span>
                      <strong style={{ fontSize: 'var(--font-sm)' }}>{action.title}</strong>
                    </div>
                    <span style={{ fontSize: 'var(--font-xs)', color: 'var(--sky)', fontWeight: 'bold' }}>
                      -{action.savings} kg/yr
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginTop: '4px' }}>
                    <button
                      className="btn btn-primary"
                      style={{ padding: '6px 10px', fontSize: '11px', flex: 1 }}
                      onClick={() => handleComplete(action.id)}
                    >
                      <Check size={12} />
                      Complete Goal
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--coral)', borderColor: 'rgba(248, 113, 113, 0.2)' }}
                      onClick={() => handleUncommit(action.id)}
                      aria-label={`Remove ${action.title}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Completed Goals History */}
          {completedActions.length > 0 && (
            <div style={{ marginTop: 'var(--spacing-md)' }}>
              <h4 style={{ fontSize: 'var(--font-sm)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--spacing-sm)' }}>
                Completed Goals ({completedActions.length})
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-xs)' }}>
                {completedActions.map(action => (
                  <div 
                    key={action.id}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      padding: '8px 12px', 
                      borderRadius: 'var(--radius-sm)', 
                      backgroundColor: 'rgba(16, 185, 129, 0.05)',
                      border: '1px solid rgba(16, 185, 129, 0.15)',
                      fontSize: 'var(--font-xs)'
                    }}
                  >
                    <span style={{ color: 'var(--text-secondary)', textDecoration: 'line-through' }}>
                      {action.title}
                    </span>
                    <button
                      onClick={() => handleUndoComplete(action.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '10px' }}
                      title="Mark as in progress again"
                    >
                      Undo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Marketplace Catalog */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="catalog-header">
            <h3 style={{ fontSize: 'var(--font-lg)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Filter size={18} style={{ color: 'var(--accent-primary)' }} />
              Eco-Action Catalog
            </h3>
            <span style={{ fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
              Showing {filteredActions.length} options
            </span>
          </div>

          {/* Filters Row */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
            {/* Category Filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {[
                { id: 'all', label: 'All Categories' },
                { id: 'home', label: '🏠 Home' },
                { id: 'travel', label: '🚗 Travel' },
                { id: 'diet', label: '🥗 Diet' },
                { id: 'waste', label: '🗑️ Waste' },
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`btn ${activeCategory === cat.id ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ padding: '6px 12px', fontSize: '11px', borderRadius: 'var(--radius-full)' }}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sub-Filters (Effort and Impact) */}
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)', flexWrap: 'wrap' }}>
              {/* Effort filter */}
              <select
                className="form-select"
                style={{ width: 'auto', padding: '4px 8px', fontSize: '11px', height: '28px' }}
                value={activeEffort}
                onChange={(e) => setActiveEffort(e.target.value)}
                aria-label="Filter by Effort"
              >
                <option value="all">All Difficulty</option>
                <option value="low">Easy Effort</option>
                <option value="medium">Medium Effort</option>
                <option value="high">High Effort</option>
              </select>

              {/* Impact filter */}
              <select
                className="form-select"
                style={{ width: 'auto', padding: '4px 8px', fontSize: '11px', height: '28px' }}
                value={activeImpact}
                onChange={(e) => setActiveImpact(e.target.value)}
                aria-label="Filter by Impact"
              >
                <option value="all">All Impact</option>
                <option value="low">Low Impact</option>
                <option value="medium">Medium Impact</option>
                <option value="high">High Impact</option>
              </select>
            </div>
          </div>

          <hr style={{ border: '0', borderTop: '1px solid var(--border-glass)' }} />

          {/* Catalog grid */}
          {filteredActions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)', color: 'var(--text-muted)' }}>
              No matches found. Try clearing your filters!
            </div>
          ) : (
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: 'var(--spacing-md)',
                maxHeight: '600px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}
              className="catalog-grid"
            >
              {filteredActions.map(action => {
                const isCommitted = committedIds.includes(action.id);
                return (
                  <div 
                    key={action.id} 
                    className="glass-panel" 
                    style={{ 
                      padding: 'var(--spacing-md)', 
                      backgroundColor: 'var(--bg-secondary)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: 'var(--spacing-md)',
                    }}
                  >
                    <div>
                      {/* Top row */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-xs)' }}>
                        <span style={{ fontSize: '14px', textTransform: 'capitalize', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {getCategoryEmoji(action.category)} {action.category}
                        </span>
                        <span style={{ fontSize: 'var(--font-sm)', color: 'var(--accent-primary)', fontWeight: 'bold' }}>
                          -{action.savings} kg/yr
                        </span>
                      </div>

                      {/* Header and description */}
                      <h4 style={{ fontSize: 'var(--font-md)', fontWeight: 700, marginBottom: '6px' }}>{action.title}</h4>
                      <p style={{ fontSize: 'var(--font-xs)', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: 'var(--spacing-sm)' }}>
                        {action.description}
                      </p>

                      {/* Badges row */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: 'var(--spacing-sm)' }}>
                        <span className={`badge ${action.effort === 'low' ? 'badge-low' : action.effort === 'medium' ? 'badge-med' : 'badge-high'}`} style={{ fontSize: '8px' }}>
                          Effort: {action.effort}
                        </span>
                        <span className="badge" style={{ fontSize: '8px', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                          Cost: {action.cost}
                        </span>
                        <span className={`badge ${action.impact === 'high' ? 'badge-low' : 'badge-med'}`} style={{ fontSize: '8px' }}>
                          Impact: {action.impact}
                        </span>
                      </div>

                      {/* Tip box */}
                      <div style={{ padding: '6px 8px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', borderLeft: '2px solid var(--accent-primary)', fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        💡 {action.tip}
                      </div>
                    </div>

                    {/* Commit button */}
                    <button
                      className={`btn ${isCommitted ? 'btn-secondary' : 'btn-primary'}`}
                      style={{ padding: '8px', fontSize: 'var(--font-xs)', width: '100%' }}
                      onClick={() => isCommitted ? handleUncommit(action.id) : handleCommit(action.id)}
                    >
                      {isCommitted ? (
                        <>
                          <Check size={12} />
                          Committed to Roadmap
                        </>
                      ) : (
                        <>
                          <Sparkles size={12} />
                          Add to Roadmap
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .roadmap-top-grid {
            grid-template-columns: 1fr !important;
          }
          .roadmap-mid-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 600px) {
          .catalog-grid {
            grid-template-columns: 1fr !important;
          }
          .catalog-header {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 4px;
          }
        }
      `}</style>
    </div>
  );
};

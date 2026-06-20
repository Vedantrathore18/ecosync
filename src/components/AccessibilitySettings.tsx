import React, { useEffect, useState } from 'react';
import { Eye, Activity, ZoomIn, Sun, Moon, Sparkles } from 'lucide-react';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ isOpen, onClose }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('eco-theme') as 'dark' | 'light') || 'dark';
  });
  const [contrast, setContrast] = useState<'normal' | 'high'>(() => {
    return (localStorage.getItem('eco-contrast') as 'normal' | 'high') || 'normal';
  });
  const [textScale, setTextScale] = useState<number>(() => {
    return Number(localStorage.getItem('eco-text-scale')) || 1.0;
  });
  const [motion, setMotion] = useState<'normal' | 'reduced'>(() => {
    return (localStorage.getItem('eco-motion') as 'normal' | 'reduced') || 'normal';
  });

  useEffect(() => {
    const root = document.documentElement;
    
    // Set theme
    root.setAttribute('data-theme', theme);
    localStorage.setItem('eco-theme', theme);

    // Set contrast
    if (contrast === 'high') {
      root.setAttribute('data-contrast', 'high');
    } else {
      root.removeAttribute('data-contrast');
    }
    localStorage.setItem('eco-contrast', contrast);

    // Set text scale
    root.style.setProperty('--text-scale', textScale.toString());
    localStorage.setItem('eco-text-scale', textScale.toString());

    // Set motion
    if (motion === 'reduced') {
      root.setAttribute('data-motion', 'reduced');
    } else {
      root.removeAttribute('data-motion');
    }
    localStorage.setItem('eco-motion', motion);
  }, [theme, contrast, textScale, motion]);

  if (!isOpen) return null;

  return (
    <div 
      className="accessibility-modal-overlay" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="accessibility-title"
    >
      <div 
        className="accessibility-drawer glass-panel slide-up" 
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '320px',
          zIndex: 100,
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-md)',
          maxHeight: '85vh',
          overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 id="accessibility-title" style={{ fontSize: 'var(--font-lg)', display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Sparkles size={20} className="text-emerald-500" style={{ color: 'var(--accent-primary)' }} />
            Accessibility & Style
          </h2>
          <button 
            className="btn btn-secondary" 
            style={{ padding: '4px 8px', fontSize: 'var(--font-xs)' }}
            onClick={onClose}
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <hr style={{ border: '0', borderTop: '1px solid var(--border-glass)' }} />

        {/* 1. Theme Selection */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
            Color Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
            <button
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px', fontSize: 'var(--font-xs)' }}
              onClick={() => setTheme('dark')}
              aria-pressed={theme === 'dark'}
            >
              Dark Forest
            </button>
            <button
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px', fontSize: 'var(--font-xs)' }}
              onClick={() => setTheme('light')}
              aria-pressed={theme === 'light'}
            >
              Bright Meadow
            </button>
          </div>
        </div>

        {/* 2. Text Scaling */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            <ZoomIn size={16} />
            Text Size
          </label>
          <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
            {[
              { label: 'A', scale: 1.0, name: 'Normal' },
              { label: 'A+', scale: 1.15, name: 'Large' },
              { label: 'A++', scale: 1.3, name: 'X-Large' },
            ].map((opt) => (
              <button
                key={opt.scale}
                className={`btn ${textScale === opt.scale ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1, padding: '8px 4px', fontSize: 'var(--font-xs)' }}
                onClick={() => setTextScale(opt.scale)}
                title={`${opt.name} font size`}
                aria-pressed={textScale === opt.scale}
              >
                {opt.label} <span style={{ fontSize: '10px', opacity: 0.8 }}>({Math.round(opt.scale * 100)}%)</span>
              </button>
            ))}
          </div>
        </div>

        {/* 3. High Contrast Mode */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            <Eye size={16} />
            Contrast
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
            <button
              className={`btn ${contrast === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px', fontSize: 'var(--font-xs)' }}
              onClick={() => setContrast('normal')}
              aria-pressed={contrast === 'normal'}
            >
              Standard
            </button>
            <button
              className={`btn ${contrast === 'high' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px', fontSize: 'var(--font-xs)' }}
              onClick={() => setContrast('high')}
              aria-pressed={contrast === 'high'}
            >
              High Contrast
            </button>
          </div>
        </div>

        {/* 4. Motion Settings */}
        <div className="form-group">
          <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
            <Activity size={16} />
            Motion & Transitions
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-sm)' }}>
            <button
              className={`btn ${motion === 'normal' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px', fontSize: 'var(--font-xs)' }}
              onClick={() => setMotion('normal')}
              aria-pressed={motion === 'normal'}
            >
              Animated
            </button>
            <button
              className={`btn ${motion === 'reduced' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '8px', fontSize: 'var(--font-xs)' }}
              onClick={() => setMotion('reduced')}
              aria-pressed={motion === 'reduced'}
              title="Disables large CSS transitions and page slide animations"
            >
              Reduced Motion
            </button>
          </div>
        </div>

        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--spacing-xs)' }}>
          Settings are saved to your browser session.
        </div>
      </div>
    </div>
  );
};

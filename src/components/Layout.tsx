import React, { useState } from 'react';
import { Leaf, Accessibility, Menu, X, Calculator, LayoutDashboard, Compass, GraduationCap, Bot } from 'lucide-react';
import { AccessibilitySettings } from './AccessibilitySettings';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accessSettingsOpen, setAccessSettingsOpen] = useState(false);

  const navItems = [
    { id: 'calculator', label: 'Calculator', icon: Calculator },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'roadmap', label: 'Green Roadmap', icon: Compass },
    { id: 'assistant', label: 'AI Assistant', icon: Bot },
    { id: 'hub', label: 'Eco Hub', icon: GraduationCap },
  ];

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Header */}
      <header 
        className="glass-panel" 
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderRadius: 0,
          borderTop: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          padding: 'var(--spacing-md) var(--spacing-xl)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Brand logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div 
            style={{
              background: 'linear-gradient(135deg, var(--accent-primary), var(--mint))',
              color: '#0b0f19',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Leaf size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-xl)', letterSpacing: '-0.02em', fontWeight: 800 }}>
              EcoSync
            </h1>
            <span style={{ fontSize: '10px', color: 'var(--text-secondary)', display: 'block', marginTop: '-2px' }}>
              Personal Carbon Reduction
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', gap: 'var(--spacing-sm)' }} className="desktop-only">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-sm)',
                  backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                  color: isActive ? '#052e16' : 'var(--text-primary)',
                  border: isActive ? 'none' : '1px solid transparent',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action controls */}
        <div style={{ display: 'flex', gap: 'var(--spacing-sm)', alignItems: 'center' }}>
          <button
            onClick={() => setAccessSettingsOpen(!accessSettingsOpen)}
            className="btn btn-secondary"
            style={{
              padding: '10px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Open accessibility menu"
            title="Accessibility Menu"
          >
            <Accessibility size={18} />
          </button>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary mobile-only"
            style={{
              padding: '10px',
              borderRadius: '50%',
              display: 'none', // Overridden in responsive CSS or styling
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="glass-panel mobile-only" 
          style={{
            position: 'fixed',
            top: '72px',
            left: '20px',
            right: '20px',
            zIndex: 49,
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-sm)',
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
                style={{
                  width: '100%',
                  justifyContent: 'flex-start',
                  padding: '12px 16px',
                }}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Core Main Content Area */}
      <main style={{ flex: 1, padding: 'var(--spacing-xl) 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer 
        className="glass-panel" 
        style={{
          borderRadius: 0,
          borderBottom: 'none',
          borderLeft: 'none',
          borderRight: 'none',
          padding: 'var(--spacing-xl) var(--spacing-lg)',
          marginTop: 'var(--spacing-xxl)',
          textAlign: 'center',
        }}
      >
        <div 
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--spacing-md)',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          className="footer-content"
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Leaf size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>EcoSync</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Empowering individuals to reach net-zero.
            </span>
          </div>

          <div style={{ display: 'flex', gap: 'var(--spacing-lg)', fontSize: 'var(--font-xs)', color: 'var(--text-muted)' }}>
            <span>Calculations based on EPA, DEFRA, and IPCC methodologies.</span>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            &copy; {new Date().getFullYear()} EcoSync Carbon Tracker. Build with clean, modern web standards.
          </p>
        </div>
      </footer>

      {/* Accessibility Settings Overlay */}
      <AccessibilitySettings 
        isOpen={accessSettingsOpen} 
        onClose={() => setAccessSettingsOpen(false)} 
      />

      {/* Embedded CSS rules for layout responsiveness */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
          .mobile-only {
            display: flex !important;
          }
          .footer-content {
            flex-direction: column !important;
            gap: var(--spacing-lg) !important;
          }
        }
      `}</style>
    </div>
  );
};

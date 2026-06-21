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
      <header className="glass-panel app-header">
        {/* Brand logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
          <div className="logo-container">
            <Leaf size={24} />
          </div>
          <div>
            <h1 className="logo-title">
              EcoSync
            </h1>
            <span className="logo-subtitle">
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
                className={`btn nav-btn ${isActive ? 'active' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={16} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Action controls */}
        <div className="header-actions">
          <button
            onClick={() => setAccessSettingsOpen(!accessSettingsOpen)}
            className="btn btn-secondary icon-btn-round"
            aria-label="Open accessibility menu"
            title="Accessibility Menu"
          >
            <Accessibility size={18} />
          </button>

          {/* Hamburger (Mobile) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn btn-secondary mobile-only icon-btn-round"
            style={{ display: 'none' }}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="glass-panel mobile-only mobile-nav-menu">
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
                className={`btn mobile-nav-btn ${isActive ? 'btn-primary' : 'btn-secondary'}`}
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
      <main className="main-content">
        <div className="main-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="glass-panel app-footer">
        <div className="footer-container footer-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
            <Leaf size={18} style={{ color: 'var(--accent-primary)' }} />
            <span style={{ fontWeight: 600, fontFamily: 'var(--font-heading)' }}>EcoSync</span>
            <span style={{ color: 'var(--text-muted)' }}>|</span>
            <span style={{ fontSize: 'var(--font-sm)', color: 'var(--text-secondary)' }}>
              Empowering individuals to reach net-zero.
            </span>
          </div>

          <div className="footer-text-row">
            <span>Calculations based on EPA, DEFRA, and IPCC methodologies.</span>
          </div>

          <p className="copyright-text">
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

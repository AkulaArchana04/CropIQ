import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { CompactLanguageToggle } from '@/components/LanguageToggle';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { href: '/', label: t('nav.home'), icon: '🏠' },
    { href: '/dashboard', label: t('nav.dashboard'), icon: '📊' },
    { href: '/soil-analysis', label: t('nav.soil'), icon: '🌱' },
    { href: '/disease-scanner', label: t('nav.disease'), icon: '🔍' },
    { href: '/ai-assistant', label: t('nav.ai'), icon: '🤖' },
    { href: '/weather-analytics', label: t('nav.weather'), icon: '🌤️' },
    { href: '/market', label: t('nav.market'), icon: '📈' },
  ];

  return (
    <nav className="bg-card border-b border-earth sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="text-xl">🌾</span>
            </div>
            <span className="text-xl font-bold text-foreground">AgriAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                  location.pathname === link.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-earth/20'
                }`}
              >
                <span>{link.icon}</span>
                <span>{link.label}</span>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-3">
            <CompactLanguageToggle />
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    👤 {t('nav.profile')}
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  {t('nav.signout')}
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-primary">
                  {t('nav.signin')}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-earth/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-earth">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-3 rounded-lg text-sm font-medium flex items-center space-x-2 ${
                    location.pathname === link.href
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-earth/20'
                  }`}
                >
                  <span>{link.icon}</span>
                  <span>{link.label}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-earth flex flex-col space-y-2">
                <CompactLanguageToggle />
                {user ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="outline" className="w-full">👤 Profile</Button>
                    </Link>
                    <Button variant="ghost" className="w-full" onClick={handleSignOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-primary">Sign In</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

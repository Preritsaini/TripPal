import React, { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import '../../styles/components/layout.css';

const Header = () => {
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <header className={`app-header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="header-content">
                <div className="logo">
                    <div className="logo-icon">✈️</div>
                    <div className="logo-blue-box">TripPal</div>
                    <div className="logo-text">
                        <span className="logo-tagline">Your Adventure Companion</span>
                    </div>
                </div>

                <div className="header-actions">
                    <button
                        className={`theme-toggle ${theme === 'dark' ? 'dark' : 'light'}`}
                        onClick={toggleTheme}
                        title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                    >
                        <div className="toggle-thumb">
                            <span className="toggle-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
                        </div>
                        <div className="toggle-track"></div>
                    </button>

                    <button
                        className="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        <div className={`menu-icon ${isMenuOpen ? 'open' : ''}`}>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </button>
                </div>
            </div>

            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <nav className="mobile-nav">
                    <a href="#dashboard" className="mobile-nav-item">Dashboard</a>
                    <a href="#itinerary" className="mobile-nav-item">Itinerary</a>
                    <a href="#packing" className="mobile-nav-item">Packing List</a>
                    <a href="#settings" className="mobile-nav-item">Settings</a>
                </nav>
            </div>
        </header>
    );
};

export default Header;
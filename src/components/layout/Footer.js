import React from 'react';
import '../../styles/components/layout.css';

const Footer = () => {
    return (
        <footer className="app-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="footer-logo">
                        <div className="logo-icon">✈️</div>
                        <div className="logo-text">TravelBuddy</div>
                    </div>
                    <div className="footer-tagline">Making travel planning simple</div>
                </div>

                <div className="footer-credits">
                    <p>
                        Created for{' '}
                        <span className="hackathon-name">Code Circuit Hackathon 2025</span>
                    </p>
                    <div className="footer-animation">
                        <div className="plane-animation">
                            <div className="plane">✈️</div>
                            <div className="trail"></div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
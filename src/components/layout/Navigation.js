import React, { useState, useEffect, useRef } from 'react';
import '../../styles/components/layout.css';

const Navigation = ({ currentPage, setCurrentPage }) => {
    const [navLoaded, setNavLoaded] = useState(false);
    const navRef = useRef(null);
    const indicatorRef = useRef(null);

    // Navigation items
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'itinerary', label: 'Itinerary', icon: '🗓️' },
        { id: 'packing', label: 'Packing List', icon: '🧳' },
        { id: 'settings', label: 'Settings', icon: '⚙️' }
    ];

    // Set nav loaded with animation delay
    useEffect(() => {
        const timeout = setTimeout(() => {
            setNavLoaded(true);
        }, 300);

        return () => clearTimeout(timeout);
    }, []);

    // Update indicator position when current page changes
    useEffect(() => {
        if (!navLoaded) return;

        const navItem = document.querySelector(`.nav-item[data-page="${currentPage}"]`);
        if (!navItem || !indicatorRef.current || !navRef.current) return;

        // Center the indicator under the active nav item
        const navItemRect = navItem.getBoundingClientRect();
        const navRect = navRef.current.getBoundingClientRect();

        const itemWidth = navItemRect.width;
        const itemLeft = navItemRect.left - navRect.left;

        // Set width and position of the indicator
        indicatorRef.current.style.width = `${itemWidth}px`;
        indicatorRef.current.style.transform = `translateX(${itemLeft}px)`;

        // Ensure the indicator is properly centered
        indicatorRef.current.style.left = '0'; // Reset any left position that might be set
    }, [currentPage, navLoaded]);

    // Handle nav item click
    const handleNavClick = (page) => {
        setCurrentPage(page);
    };

    return (
        <nav className="main-nav" ref={navRef}>
            <div className="nav-items-container">
                {navItems.map((item, index) => (
                    <button
                        key={item.id}
                        className={`nav-item ${currentPage === item.id ? 'active' : ''} ${navLoaded ? 'loaded' : ''}`}
                        onClick={() => handleNavClick(item.id)}
                        data-page={item.id}
                        style={{
                            animationDelay: `${index * 0.1}s`,
                            position: 'relative'  // Ensure position is relative
                        }}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}

                <div
                    className={`nav-indicator ${navLoaded ? 'visible' : ''}`}
                    ref={indicatorRef}
                ></div>
            </div>
        </nav>
    );
};

export default Navigation;
import React, { useRef, useEffect, useState } from 'react';
import '../../styles/components/packingList.css';

const CategoryTabs = ({ categories, activeCategory, onCategoryChange }) => {
    const tabsContainerRef = useRef(null);
    const tabsRef = useRef([]);
    const indicatorRef = useRef(null);
    const [tabsLoaded, setTabsLoaded] = useState(false);

    // Update active tab indicator position
    useEffect(() => {
        if (!tabsLoaded) return;

        const activeIndex = categories.findIndex(category => category.id === activeCategory);
        if (activeIndex === -1) return;

        const activeTab = tabsRef.current[activeIndex];
        const indicator = indicatorRef.current;

        if (activeTab && indicator) {
            const tabRect = activeTab.getBoundingClientRect();
            const containerRect = tabsContainerRef.current.getBoundingClientRect();

            indicator.style.width = `${tabRect.width}px`;
            indicator.style.transform = `translateX(${tabRect.left - containerRect.left}px)`;
        }
    }, [activeCategory, categories, tabsLoaded]);

    // Initialize tabs with animation
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setTabsLoaded(true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, []);

    // Handle tab click
    const handleTabClick = (categoryId) => {
        onCategoryChange(categoryId);
    };

    // Handle smooth horizontal scrolling for tabs
    const handleScroll = (direction) => {
        const container = tabsContainerRef.current;
        if (!container) return;

        const scrollAmount = direction === 'left' ? -200 : 200;
        container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div className="category-tabs-wrapper">
            <button
                className="tab-scroll-btn left"
                onClick={() => handleScroll('left')}
                aria-label="Scroll tabs left"
            >
                <span className="scroll-arrow left"></span>
            </button>

            <div className="category-tabs" ref={tabsContainerRef}>
                {categories.map((category, index) => (
                    <button
                        key={category.id}
                        ref={el => tabsRef.current[index] = el}
                        className={`category-tab ${activeCategory === category.id ? 'active' : ''} ${tabsLoaded ? 'loaded' : ''}`}
                        onClick={() => handleTabClick(category.id)}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <span className="category-icon">{category.icon}</span>
                        <span className="category-label">{category.label}</span>
                    </button>
                ))}

                <div
                    className={`tab-indicator ${tabsLoaded ? 'visible' : ''}`}
                    ref={indicatorRef}
                ></div>
            </div>

            <button
                className="tab-scroll-btn right"
                onClick={() => handleScroll('right')}
                aria-label="Scroll tabs right"
            >
                <span className="scroll-arrow right"></span>
            </button>
        </div>
    );
};

export default CategoryTabs;
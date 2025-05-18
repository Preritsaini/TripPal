import React, { useState, useRef, useEffect } from 'react';
import '../../styles/components/packingList.css';

const ChecklistItem = ({
                           item,
                           onToggle,
                           onRemove,
                           categoryLabel,
                           priorityLabel,
                           isAnimating
                       }) => {
    const [isHovered, setIsHovered] = useState(false);
    const itemRef = useRef(null);

    // Get priority color
    const getPriorityColor = (priority) => {
        switch(priority) {
            case 'high':
                return '#fa5252';
            case 'medium':
                return '#fd7e14';
            case 'low':
                return '#40c057';
            default:
                return '#adb5bd';
        }
    };

    // Get priority icon
    const getPriorityIcon = (priority) => {
        switch(priority) {
            case 'high':
                return '🔴';
            case 'medium':
                return '🟠';
            case 'low':
                return '🟢';
            default:
                return '⚪';
        }
    };

    // Handle checkbox animation
    const handleCheckToggle = () => {
        const checkbox = itemRef.current.querySelector('.checkmark');

        // Add animation class
        checkbox.classList.add('animated');

        // Remove animation class after animation completes
        setTimeout(() => {
            checkbox.classList.remove('animated');
            onToggle();
        }, 400);
    };

    // Handle delete animation
    const handleRemove = () => {
        // Add exit animation class
        itemRef.current.classList.add('removing');

        // Remove item after animation completes
        setTimeout(() => {
            onRemove();
        }, 500);
    };

    return (
        <div
            className={`checklist-item ${item.packed ? 'packed' : ''} ${isAnimating ? 'animating' : ''}`}
            ref={itemRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="item-checkbox">
                <label className="checkbox-container">
                    <input
                        type="checkbox"
                        checked={item.packed}
                        onChange={handleCheckToggle}
                    />
                    <span className="checkmark"></span>
                </label>
            </div>

            <div className="item-content">
                <div className="item-name">
                    {item.name}
                </div>

                <div className="item-details">
          <span
              className="item-category"
              title={`Category: ${categoryLabel}`}
          >
            {item.category === 'essentials' && '🔑'}
              {item.category === 'clothing' && '👕'}
              {item.category === 'electronics' && '📱'}
              {item.category === 'toiletries' && '🧼'}
              {item.category === 'health' && '💊'}
              {item.category === 'comfort' && '🛌'}
              {categoryLabel}
          </span>

                    <span
                        className="item-priority"
                        style={{ color: getPriorityColor(item.priority) }}
                        title={`Priority: ${priorityLabel}`}
                    >
            {getPriorityIcon(item.priority)} {priorityLabel}
          </span>
                </div>
            </div>

            <div className={`item-actions ${isHovered ? 'visible' : ''}`}>
                <button
                    className="remove-item-btn"
                    onClick={handleRemove}
                    title="Remove item"
                >
                    <span className="trash-icon">🗑️</span>
                </button>
            </div>

            {/* Progress line animation for packed items */}
            {item.packed && (
                <div className="progress-line"></div>
            )}
        </div>
    );
};

export default ChecklistItem;
import React, { useState, useRef } from 'react';
import '../styles/components/card.css';
const Card = ({
                  children,
                  variant = 'default',
                  size = 'medium',
                  animation = 'hover-lift',
                  header,
                  footer,
                  media,
                  clickable = false,
                  onClick,
                  className = '',
                  ...props
              }) => {
    const [isHovered, setIsHovered] = useState(false);
    const cardRef = useRef(null);
    const handleMouseMove = (e) => {
        if (animation !== 'tilt' || !cardRef.current) return;

        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const tiltX = ((y / rect.height) - 0.5) * 10;
        const tiltY = ((x / rect.width) - 0.5) * -10;

        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    };

    const resetTilt = () => {
        if (animation !== 'tilt' || !cardRef.current) return;

        const card = cardRef.current;
        card.style.transform = '';
    };

    return (
        <div
            ref={cardRef}
            className={`
        tb-card
        tb-card--${variant}
        tb-card--${size}
        tb-card--${animation}
        ${clickable ? 'tb-card--clickable' : ''}
        ${isHovered ? 'tb-card--hovered' : ''}
        ${className}
      `}
            onClick={clickable && onClick ? onClick : undefined}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                resetTilt();
            }}
            onMouseMove={handleMouseMove}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable ? 0 : undefined}
            onKeyDown={clickable && onClick ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick(e);
                }
            } : undefined}
            {...props}
        >
            {/* Card lighting effect for glow animation */}
            {animation === 'hover-glow' && (
                <div className="tb-card__glow-effect"></div>
            )}

            {/* Card header */}
            {header && (
                <div className="tb-card__header">
                    {header}
                </div>
            )}

            {/* Card media */}
            {media && (
                <div className="tb-card__media">
                    {media}
                </div>
            )}

            {/* Card content */}
            <div className="tb-card__content">
                {children}
            </div>

            {/* Card footer */}
            {footer && (
                <div className="tb-card__footer">
                    {footer}
                </div>
            )}
        </div>
    );
};

export default Card;

import React from 'react';
import '/home/prerit/WebstormProjects/codecircuitproj/src/styles/components/button.css';
const Button = ({
                    children,
                    variant = 'primary',
                    size = 'medium',
                    animation = 'ripple',
                    isFullWidth = false,
                    isLoading = false,
                    isDisabled = false,
                    onClick,
                    leftIcon,
                    rightIcon,
                    className = '',
                    type = 'button',
                    ...props
                }) => {
    const handleRipple = (e) => {
        if (animation !== 'ripple' || isDisabled || isLoading) return;

        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(button.offsetWidth, button.offsetHeight);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);
        setTimeout(() => {
            ripple.remove();
        }, 600);
    };

    const handleClick = (e) => {
        if (isLoading || isDisabled) return;

        if (animation === 'ripple') {
            handleRipple(e);
        }

        if (onClick) onClick(e);
    };

    return (
        <button
            type={type}
            onClick={handleClick}
            disabled={isDisabled || isLoading}
            className={`
        tb-button
        tb-button--${variant}
        tb-button--${size}
        tb-button--${animation}
        ${isFullWidth ? 'tb-button--full-width' : ''}
        ${isLoading ? 'tb-button--loading' : ''}
        ${isDisabled ? 'tb-button--disabled' : ''}
        ${className}
      `}
            {...props}
        >
            {isLoading && (
                <span className="tb-button__loader">
          <span className="tb-button__loader-dot"></span>
          <span className="tb-button__loader-dot"></span>
          <span className="tb-button__loader-dot"></span>
        </span>
            )}

            <span className="tb-button__content">
        {leftIcon && <span className="tb-button__icon tb-button__icon--left">{leftIcon}</span>}
                <span className="tb-button__text">{children}</span>
                {rightIcon && <span className="tb-button__icon tb-button__icon--right">{rightIcon}</span>}
      </span>
        </button>
    );
};

export default Button;

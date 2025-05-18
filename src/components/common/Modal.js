import React, { useState, useEffect, useRef } from 'react';
import '/home/prerit/WebstormProjects/codecircuitproj/src/styles/components/modal.css';

const Modal = ({
                   children,
                   isOpen,
                   onClose,
                   size = 'medium',
                   animation = 'fade',
                   closeOnEsc = true,
                   closeOnOutsideClick = true,
                   title,
                   footer,
                   showCloseButton = true,
                   className = '',
                   ...props
               }) => {
    const [isAnimating, setIsAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const modalRef = useRef(null);
    const contentRef = useRef(null);

    const bodyOverflowRef = useRef('');

    useEffect(() => {
        if (isOpen) {
            bodyOverflowRef.current = document.body.style.overflow;
            document.body.style.overflow = 'hidden';

            setIsVisible(true);
            setIsAnimating(true);

            const animationDuration = 300;

            setTimeout(() => {
                setIsAnimating(false);

                if (contentRef.current) {
                    const focusableElements = contentRef.current.querySelectorAll(
                        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                    );

                    if (focusableElements.length > 0) {
                        focusableElements[0].focus();
                    } else {
                        contentRef.current.focus();
                    }
                }
            }, animationDuration);
        }
        else if (isVisible) {
            setIsAnimating(true);

            const animationDuration = 300;

            setTimeout(() => {
                setIsVisible(false);
                setIsAnimating(false);

                document.body.style.overflow = bodyOverflowRef.current;
            }, animationDuration);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape' && closeOnEsc && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, closeOnEsc, onClose]);

    // Handle outside click
    const handleBackdropClick = (e) => {
        if (closeOnOutsideClick && e.target === modalRef.current) {
            onClose();
        }
    };

    if (!isOpen && !isVisible) {
        return null;
    }

    return (
        <div
            ref={modalRef}
            className={`
        tb-modal
        ${isVisible ? 'tb-modal--visible' : ''}
        ${isAnimating ? 'tb-modal--animating' : ''}
        tb-modal--animation-${animation}
      `}
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            {...props}
        >
            <div
                ref={contentRef}
                className={`
          tb-modal__content
          tb-modal__content--${size}
          ${className}
        `}
                tabIndex="-1"
            >
                {/* Modal header */}
                {(title || showCloseButton) && (
                    <div className="tb-modal__header">
                        {title && (
                            <h2 id="modal-title" className="tb-modal__title">
                                {title}
                            </h2>
                        )}

                        {showCloseButton && (
                            <button
                                type="button"
                                className="tb-modal__close"
                                onClick={onClose}
                                aria-label="Close modal"
                            >
                                <span className="tb-modal__close-icon" aria-hidden="true">×</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Modal body */}
                <div className="tb-modal__body">
                    {children}
                </div>

                {/* Modal footer */}
                {footer && (
                    <div className="tb-modal__footer">
                        {footer}
                    </div>
                )}
            </div>

            {/* Modal backdrop */}
            <div className="tb-modal__backdrop"></div>
        </div>
    );
};

export default Modal;

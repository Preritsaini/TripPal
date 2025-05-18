import { useRef, useEffect } from 'react';

// Custom hook for animations
function useAnimation(options = {}) {
    const {
        threshold = 0.1,
        root = null,
        rootMargin = '0px',
        freezeOnceVisible = false
    } = options;

    const elementRef = useRef(null);
    const animationRan = useRef(false);

    useEffect(() => {
        const element = elementRef.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            entries => {
                const [entry] = entries;

                // If already ran animation and freeze is set, don't run again
                if (animationRan.current && freezeOnceVisible) return;

                if (entry.isIntersecting) {
                    // Add animation class when element is visible
                    element.classList.add('animate');

                    if (freezeOnceVisible) {
                        animationRan.current = true;
                    }

                    // Optionally, remove observer if freezeOnceVisible is true
                    if (freezeOnceVisible) {
                        observer.unobserve(element);
                    }
                } else if (!freezeOnceVisible) {
                    // Remove animation class when element is not visible
                    // (only if we're not freezing animations once they've run)
                    element.classList.remove('animate');
                }
            },
            {
                threshold,
                root,
                rootMargin
            }
        );

        observer.observe(element);

        return () => {
            if (element) {
                observer.unobserve(element);
            }
        };
    }, [threshold, root, rootMargin, freezeOnceVisible]);

    return elementRef;
}

// Hook for animating elements when they come into view
export const useScrollAnimation = (options = {}) => {
    return useAnimation({
        ...options,
        freezeOnceVisible: true
    });
};

// Hook for adding continuous animation
export const useContinuousAnimation = (options = {}) => {
    return useAnimation({
        ...options,
        freezeOnceVisible: false
    });
};

// Hook for countdown animation
export const useCountdownAnimation = (targetDate, onComplete) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate) - new Date();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((difference / 1000 / 60) % 60);
                const seconds = Math.floor((difference / 1000) % 60);

                return {
                    days,
                    hours,
                    minutes,
                    seconds
                };
            } else {
                if (onComplete) {
                    onComplete();
                }
                return {
                    days: 0,
                    hours: 0,
                    minutes: 0,
                    seconds: 0
                };
            }
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        // Update the countdown every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [targetDate, onComplete]);

    return timeLeft;
};

export default {
    useScrollAnimation,
    useContinuousAnimation,
    useCountdownAnimation
};
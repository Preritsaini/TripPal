import React, { createContext, useContext, useState, useEffect } from 'react';

// Create context
const ThemeContext = createContext();

// Custom hook to use the theme context
export const useTheme = () => {
    return useContext(ThemeContext);
};

// Provider component
export const ThemeProvider = ({ children }) => {
    // Initialize theme from localStorage or system preference
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        // Check system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light';
    });

    // Handle theme change
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    // Save theme to localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);

        // Add/remove dark class from document for global styling
        if (theme === 'dark') {
            document.documentElement.classList.add('dark-theme');
        } else {
            document.documentElement.classList.remove('dark-theme');
        }
    }, [theme]);

    const value = {
        theme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
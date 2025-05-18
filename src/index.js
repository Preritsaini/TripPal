import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/global.css';
import App from './App';
import { TripProvider } from './context/TripContext';
import { ThemeProvider } from './context/ThemeContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ThemeProvider>
            <TripProvider>
                <App />
            </TripProvider>
        </ThemeProvider>
    </React.StrictMode>
);
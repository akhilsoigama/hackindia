import React, { useEffect, useState, ReactNode } from 'react';
import { ThemeContext, ThemeMode } from './AppThemeProvider';

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [mode, setMode] = useState<ThemeMode>(() => {
        let savedMode = localStorage.getItem('theme') || '';
        savedMode = savedMode.replace(/^"(.*)"$/, '$1');
        console.log('[Theme] Initializing theme state. parsed savedMode:', savedMode);
        if (savedMode === 'light' || savedMode === 'dark') {
            return savedMode as ThemeMode;
        }
        return 'light';
    });

    useEffect(() => {
        console.log('[Theme] useEffect triggered. Setting mode in localStorage:', mode);
        localStorage.setItem('theme', mode);
        if (mode === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [mode]);

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme, setMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

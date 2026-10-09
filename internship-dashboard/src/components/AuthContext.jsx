import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const userStr = localStorage.getItem('internDost_user');
        return userStr ? JSON.parse(userStr) : null;
    });

    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('internDost_user', JSON.stringify(userData));
        if (token) localStorage.setItem('internDost_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('internDost_user');
        localStorage.removeItem('internDost_token');
    };

    useEffect(() => {
        const token = localStorage.getItem('internDost_token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.exp * 1000 < Date.now()) {
                    logout();
                }
            } catch (e) {
                logout();
            }
        }

        const originalFetch = window.fetch;
        window.fetch = async (...args) => {
            const response = await originalFetch(...args);
            if (response.status === 401) {
                logout();
            }
            return response;
        };

        return () => {
            window.fetch = originalFetch;
        };
    }, []);



    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
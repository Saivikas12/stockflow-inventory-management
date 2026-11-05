import { createContext, useContext, useState } from 'react';

import api from '../services/api';

// Create Authentication Context
const C = createContext(null);

// Authentication Provider
export function AuthProvider({ children }) {

    const [user, setUser] = useState(() =>
        JSON.parse(localStorage.getItem('stockflow_user') || 'null')
    );

    // Save User Details and JWT Token
    const save = (d) => {

        localStorage.setItem('stockflow_token', d.token);

        const u = {
            email: d.email,
            organizationName: d.organizationName
        };

        localStorage.setItem(
            'stockflow_user',
            JSON.stringify(u)
        );

        setUser(u);
    };

    // Login
    const login = async (data) => {

        const response = await api.post('/auth/login', data);

        save(response.data);
    };

    // Signup
    const signup = async (data) => {

        const response = await api.post('/auth/signup', data);

        save(response.data);
    };

    // Logout
    const logout = () => {

        localStorage.removeItem('stockflow_token');
        localStorage.removeItem('stockflow_user');

        setUser(null);
    };

    return (
        <C.Provider
            value={{
                user,
                login,
                signup,
                logout
            }}
        >
            {children}
        </C.Provider>
    );
}

// Custom Authentication Hook
export const useAuth = () => useContext(C);
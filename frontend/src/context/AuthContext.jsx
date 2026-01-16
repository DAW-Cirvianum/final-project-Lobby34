import { createContext, useState, useContext } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // Check localStorage on load to keep user logged in on refresh
    const [user, setUser] = useState(localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
    const [token, setToken] = useState(localStorage.getItem('token'));

    const login = async (username, password) => {
        try {
            const response = await api.post('/login', { login: username, password });
            const newToken = response.data.token;
            const newUser = response.data.user;

            localStorage.setItem('token', newToken);
            localStorage.setItem('user', JSON.stringify(newUser));
            
            setToken(newToken);
            setUser(newUser);
            return true;
        } catch (error) {
            console.error("Login failed", error);
            return false;
        }
    };

    const logout = async () => {
        try { await api.post('/logout'); } catch (e) { /* ignore */ }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
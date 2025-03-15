import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

    // Set auth token for axios requests
    const setAuthToken = (token) => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    };

    // Load user from localStorage on app init
    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem('userToken');
            const userData = localStorage.getItem('userData');
            
            if (token && userData) {
                setAuthToken(token);
                setCurrentUser(JSON.parse(userData));
                setIsAuthenticated(true);
            }
            
            setLoading(false);
        };
        
        loadUser();
    }, []);

    // Login user
    const login = async (email, password) => {
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', {
                email,
                password
            });
            
            if (res.data.success) {
                localStorage.setItem('userToken', res.data.token);
                localStorage.setItem('userData', JSON.stringify(res.data.user));
                
                setAuthToken(res.data.token);
                setCurrentUser(res.data.user);
                setIsAuthenticated(true);
                
                return res.data.user;
            }
        } catch (error) {
            throw error;
        }
    };

    // Register user
    const register = async (formData) => {
        try {
            const res = await axios.post(
                'http://localhost:5000/api/users/register', 
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    // Logout user
    const logout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setAuthToken(null);
        setCurrentUser(null);
        setIsAuthenticated(false);
        navigate('/login');
    };

    // Check if user has specific role/level
    const hasRole = (requiredLevel) => {
        if (!currentUser) return false;
        return currentUser.userLevel <= requiredLevel;
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated,
                loading,
                login,
                register,
                logout,
                hasRole
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
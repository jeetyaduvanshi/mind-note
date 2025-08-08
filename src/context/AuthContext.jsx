import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, getCurrentUser, isAuthenticated, clearAuth } from '../services/api';

// Initial state
const initialState = {
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null,
};

// Action types
const ActionTypes = {
    LOGIN_START: 'LOGIN_START',
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    LOGOUT: 'LOGOUT',
    REGISTER_START: 'REGISTER_START',
    REGISTER_SUCCESS: 'REGISTER_SUCCESS',
    REGISTER_FAILURE: 'REGISTER_FAILURE',
    UPDATE_PROFILE_SUCCESS: 'UPDATE_PROFILE_SUCCESS',
    SET_LOADING: 'SET_LOADING',
    CLEAR_ERROR: 'CLEAR_ERROR',
    LOAD_USER: 'LOAD_USER',
};

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case ActionTypes.LOGIN_START:
        case ActionTypes.REGISTER_START:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case ActionTypes.LOGIN_SUCCESS:
        case ActionTypes.REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: true,
                loading: false,
                error: null,
            };

        case ActionTypes.LOGIN_FAILURE:
        case ActionTypes.REGISTER_FAILURE:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: action.payload,
            };

        case ActionTypes.LOGOUT:
            return {
                ...state,
                user: null,
                isAuthenticated: false,
                loading: false,
                error: null,
            };

        case ActionTypes.UPDATE_PROFILE_SUCCESS:
            return {
                ...state,
                user: action.payload.user,
                error: null,
            };

        case ActionTypes.SET_LOADING:
            return {
                ...state,
                loading: action.payload,
            };

        case ActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            };

        case ActionTypes.LOAD_USER:
            return {
                ...state,
                user: action.payload.user,
                isAuthenticated: action.payload.isAuthenticated,
                loading: false,
            };

        default:
            return state;
    }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Load user from localStorage on app start
    useEffect(() => {
        const loadUser = () => {
            const user = getCurrentUser();
            const authenticated = isAuthenticated();

            dispatch({
                type: ActionTypes.LOAD_USER,
                payload: {
                    user,
                    isAuthenticated: authenticated,
                },
            });
        };

        loadUser();
    }, []);

    // Login function
    const login = async (credentials) => {
        try {
            dispatch({ type: ActionTypes.LOGIN_START });

            const response = await authAPI.login(credentials);

            dispatch({
                type: ActionTypes.LOGIN_SUCCESS,
                payload: response,
            });

            return response;
        } catch (error) {
            dispatch({
                type: ActionTypes.LOGIN_FAILURE,
                payload: error.message,
            });
            throw error;
        }
    };

    // Register function
    const register = async (userData) => {
        try {
            dispatch({ type: ActionTypes.REGISTER_START });

            const response = await authAPI.register(userData);

            dispatch({
                type: ActionTypes.REGISTER_SUCCESS,
                payload: response,
            });

            return response;
        } catch (error) {
            dispatch({
                type: ActionTypes.REGISTER_FAILURE,
                payload: error.message,
            });
            throw error;
        }
    };

    // Logout function
    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearAuth();
            dispatch({ type: ActionTypes.LOGOUT });
        }
    };

    // Update profile function
    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);

            dispatch({
                type: ActionTypes.UPDATE_PROFILE_SUCCESS,
                payload: response.data,
            });

            return response;
        } catch (error) {
            throw error;
        }
    };

    // Clear error function
    const clearError = () => {
        dispatch({ type: ActionTypes.CLEAR_ERROR });
    };

    // Context value
    const value = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
        clearError,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return context;
};

export default AuthContext;

import { useEffect, useState } from 'react';
import {
    clearAuthSession,
    getAuthToken,
    getCurrentUserRequest,
    getStoredAuthUser,
    loginRequest,
    setAuthSession,
    signupRequest,
    subscribeToAuthChanges,
    type AuthUser,
    type LoginPayload,
    type SignupPayload,
} from '../lib/auth';

type AuthState = {
    currentUser: AuthUser | null;
    isAuthenticated: boolean;
    isLoading: boolean;
};

const readAuthState = (): AuthState => {
    const token = getAuthToken();
    const user = getStoredAuthUser();

    return {
        currentUser: user,
        isAuthenticated: Boolean(token && user),
        isLoading: false,
    };
};

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>(() => readAuthState());

    useEffect(() => {
        const syncAuthState = () => setAuthState(readAuthState());
        return subscribeToAuthChanges(syncAuthState);
    }, []);

    useEffect(() => {
        const token = getAuthToken();
        if (!token) return;

        let isActive = true;
        setAuthState((state) => ({ ...state, isLoading: true }));

        getCurrentUserRequest()
            .then((response) => {
                if (!isActive) return;
                setAuthSession({ token, user: response.user });
                setAuthState({
                    currentUser: response.user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            })
            .catch(() => {
                if (!isActive) return;
                clearAuthSession();
                setAuthState({
                    currentUser: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            });

        return () => {
            isActive = false;
        };
    }, []);

    const login = async (payload: LoginPayload) => {
        const response = await loginRequest(payload);
        setAuthSession({ token: response.token, user: response.user });
        setAuthState({
            currentUser: response.user,
            isAuthenticated: true,
            isLoading: false,
        });
        return response.user;
    };

    const signup = async (payload: SignupPayload) => {
        const response = await signupRequest(payload);
        setAuthSession({ token: response.token, user: response.user });
        setAuthState({
            currentUser: response.user,
            isAuthenticated: true,
            isLoading: false,
        });
        return response.user;
    };

    const logout = () => {
        clearAuthSession();
        setAuthState({
            currentUser: null,
            isAuthenticated: false,
            isLoading: false,
        });
    };

    return {
        ...authState,
        login,
        signup,
        logout,
    };
};

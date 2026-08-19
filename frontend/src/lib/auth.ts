export type AuthUser = {
    id: string;
    name: string;
    username: string;
    email: string;
    avatar?: {
        url?: string;
        publicId?: string;
    };
    location?: string;
    bio?: string;
    authProvider?: 'local' | 'google';
    role?: 'user' | 'admin';
};

export type AuthResponse = {
    success: boolean;
    token: string;
    user: AuthUser;
};

export type LoginPayload = {
    email: string;
    password: string;
};

export type SignupPayload = {
    name: string;
    email: string;
    password: string;
};

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
const authTokenKey = 'boi-station-auth-token';
const authUserKey = 'boi-station-auth-user';
const authChangeEvent = 'boi-station-auth-change';

export const getAuthToken = () => {
    if (typeof window === 'undefined') return null;
    return window.localStorage.getItem(authTokenKey);
};

export const getStoredAuthUser = (): AuthUser | null => {
    if (typeof window === 'undefined') return null;

    const storedUser = window.localStorage.getItem(authUserKey);
    if (!storedUser) return null;

    try {
        return JSON.parse(storedUser) as AuthUser;
    } catch {
        window.localStorage.removeItem(authUserKey);
        return null;
    }
};

export const setAuthSession = ({ token, user }: { token: string; user: AuthUser }) => {
    window.localStorage.setItem(authTokenKey, token);
    window.localStorage.setItem(authUserKey, JSON.stringify(user));
    window.dispatchEvent(new Event(authChangeEvent));
};

export const clearAuthSession = () => {
    window.localStorage.removeItem(authTokenKey);
    window.localStorage.removeItem(authUserKey);
    window.dispatchEvent(new Event(authChangeEvent));
};

export const subscribeToAuthChanges = (listener: () => void) => {
    window.addEventListener(authChangeEvent, listener);
    window.addEventListener('storage', listener);

    return () => {
        window.removeEventListener(authChangeEvent, listener);
        window.removeEventListener('storage', listener);
    };
};

type RequestOptions = RequestInit & {
    auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
    const { auth = false, headers, ...requestOptions } = options;
    const token = getAuthToken();
    const isFormData = requestOptions.body instanceof FormData;

    const response = await fetch(`${apiBaseUrl}${path}`, {
        ...requestOptions,
        headers: {
            ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
            ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
            ...headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || 'Could not connect. Please try again.');
    }

    return data as T;
}

export const loginRequest = (payload: LoginPayload) =>
    apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

export const signupRequest = (payload: SignupPayload) =>
    apiRequest<AuthResponse>('/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
    });

export const getCurrentUserRequest = () =>
    apiRequest<{ success: boolean; user: AuthUser }>('/auth/me', {
        auth: true,
    });

export const getSafeRedirectPath = (path: string | null | undefined) => {
    if (!path || !path.startsWith('/') || path.startsWith('//') || path.startsWith('/login')) {
        return '/buy-sell';
    }

    return path;
};

export const createLoginRedirect = (path: string) => `/login?redirect=${encodeURIComponent(getSafeRedirectPath(path))}`;

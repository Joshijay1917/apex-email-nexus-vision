import Constants from 'expo-constants';
import * as WebBrowser from "expo-web-browser";

// When developing locally, React Native (especially Android emulator) needs the host machine's IP.
// On localhost, 10.0.2.2 is used for Android Emulators, and localhost for iOS.
// Better yet, dynamically grabbing it from expo constants handles physical device debugging too.
const getBaseUrl = () => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URI;
    console.log("Backend url from env:", url)
    if (url) {
        return url;
    }
    if (__DEV__) {
        const debuggerHost = Constants.expoConfig?.hostUri;
        const localhost = debuggerHost ? debuggerHost.split(':')[0] : 'localhost';
        // Use your backend port here
        return `http://${localhost}:3000`;
    }
};

let authToken: string | null = null;

export const BASE_URL = getBaseUrl();

/**
 * Set the global authorization token for all subsequent API calls.
 */
export const setAuthToken = (token: string | null) => {
    authToken = token;
};

interface RequestOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
}

const apiClient = async (endpoint: string, options: RequestOptions = {}) => {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

    if (endpoint.includes("login")) {
        return await WebBrowser.openBrowserAsync(url);
    }

    const defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    };

    // Inject the token globally if it was set during onboarding
    if (authToken) {
        defaultHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    const config: RequestInit = {
        method: options.method || 'GET',
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };

    if (options.body) {
        config.body = JSON.stringify(options.body);
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json().catch(() => ({})); // fallback to empty obj if no json

        if (!response.ok) {
            return Promise.reject({
                status: response.status,
                message: data.message || 'Something went wrong',
                data
            });
        }

        return data;
    } catch (error: any) {
        return Promise.reject({
            status: 500,
            message: error.message || 'Network connection error',
        });
    }
};

export const api = {
    get: (endpoint: string, headers?: Record<string, string>) =>
        apiClient(endpoint, { method: 'GET', headers }),

    post: (endpoint: string, body: any, headers?: Record<string, string>) =>
        apiClient(endpoint, { method: 'POST', body, headers }),

    put: (endpoint: string, body: any, headers?: Record<string, string>) =>
        apiClient(endpoint, { method: 'PUT', body, headers }),

    patch: (endpoint: string, body: any, headers?: Record<string, string>) =>
        apiClient(endpoint, { method: 'PATCH', body, headers }),

    delete: (endpoint: string, headers?: Record<string, string>) =>
        apiClient(endpoint, { method: 'DELETE', headers }),
};

export default api;

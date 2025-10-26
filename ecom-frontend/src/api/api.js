import axios from "axios";

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACK_END_URL}/api`,
    withCredentials: true,
});

// Add request interceptor to attach JWT token from localStorage
api.interceptors.request.use(
    (config) => {
        // ALWAYS read fresh from localStorage on EVERY request
        const authData = localStorage.getItem("auth");
        console.log('Interceptor - auth data from localStorage:', authData ? 'exists' : 'missing');
        
        if (authData) {
            try {
                const auth = JSON.parse(authData);
                console.log('Interceptor - parsed auth:', { 
                    hasJwtToken: !!auth.jwtToken,
                    username: auth.username 
                });
                
                // If we have a JWT token, add it to Authorization header
                if (auth.jwtToken) {
                    config.headers.Authorization = `Bearer ${auth.jwtToken}`;
                    console.log('Interceptor - JWT attached to header');
                } else {
                    console.log('Interceptor - NO jwtToken in auth data');
                }
            } catch (error) {
                console.error("Error parsing auth data:", error);
                // Clear invalid auth data
                localStorage.removeItem("auth");
            }
        } else {
            console.log('Interceptor - No auth data in localStorage');
            // Make sure no old token is attached
            delete config.headers.Authorization;
        }
        
        console.log('API Request:', {
            url: config.url,
            method: config.method,
            hasAuthHeader: !!config.headers.Authorization,
            authHeader: config.headers.Authorization ? 'Bearer ***' : 'none'
        });
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to log errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API Error Response:', {
            url: error.config?.url,
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            headers: error.response?.headers
        });
        
        // Don't auto-redirect, let components handle it
        // Component will handle logout and redirect if needed
        
        return Promise.reject(error);
    }
);

export default api;
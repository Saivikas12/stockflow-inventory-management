import axios from 'axios';

// Create Axios Instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
});

// Request Interceptor
api.interceptors.request.use(config => {

    const token = localStorage.getItem('stockflow_token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Response Interceptor
api.interceptors.response.use(

    response => response,

    error => {

        if (error.response?.status === 401) {

            // Clear Authentication Data
            localStorage.removeItem('stockflow_token');
            localStorage.removeItem('stockflow_user');

            // Redirect to Login Page
            if (
                !location.pathname.startsWith('/login') &&
                !location.pathname.startsWith('/signup')
            ) {
                location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
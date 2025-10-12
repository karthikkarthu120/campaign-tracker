import axios from 'axios';

// Create axios instance with base configuration
const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
API.interceptors.request.use(
    (config) => {
        if (process.env.NODE_ENV === 'development') {
            console.debug('[API] Request:', config.method?.toUpperCase(), config.url);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

API.interceptors.response.use(
    (response) => response,
    (error) => {
        const payload = error.response?.data || { success: false, message: 'Network Error', error: error.message };
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', payload);
        }
        return Promise.reject(payload);
    }
);

const campaignService = {
    getAllCampaigns: async () => {
        try {
            const response = await API.get('/campaigns');
            // backend returns { success: true, data: [...], message }
            return { data: response.data.data };
        } catch (error) {
            throw error;
        }
    },

    // Create new campaign
    createCampaign: async (campaignData) => {
        try {
            const response = await API.post('/campaigns', campaignData);
            return { data: response.data.data };
        } catch (error) {
            throw error;
        }
    },

    updateCampaignStatus: async (id, status) => {
        try {
            const response = await API.put(`/campaigns/${id}/status`, { status });
            return { data: response.data.data };
        } catch (error) {
            throw error;
        }
    },

    deleteCampaign: async (id) => {
        try {
            const response = await API.delete(`/campaigns/${id}`);
            // backend returns { success: true, message }
            return { data: response.data };
        } catch (error) {
            throw error;
        }
    }
};

export default campaignService;

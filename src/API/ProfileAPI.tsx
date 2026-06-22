import axios, { AxiosInstance } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'https://vehicle-inspection-app-server.onrender.com';

const profileAPI: AxiosInstance = axios.create({
    baseURL: `${API_BASE_URL}/api/profiles`,
});

interface ProfileData {
    [key: string]: unknown;
}

// Add token to requests
profileAPI.interceptors.request.use((config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Create a new profile
export const createProfile = (profileData: ProfileData) => {
    return profileAPI.post<ProfileData>("/", profileData);
};

// Get all profiles
export const getAllProfiles = () => {
    return profileAPI.get<ProfileData[]>("/");
};

// Get profile by ID
export const getProfileById = (id: string | number) => {
    return profileAPI.get<ProfileData>(`/${id}`);
};

// Update profile
export const updateProfile = (id: string | number, profileData: ProfileData) => {
    return profileAPI.put<ProfileData>(`/${id}`, profileData);
};

// Delete profile
export const deleteProfile = (id: string | number) => {
    return profileAPI.delete<void>(`/${id}`);
};

// Search profiles
export const searchProfiles = (query: string) => {
    return profileAPI.get<ProfileData[]>("/search", { params: { query } });
};

export default {
    createProfile,
    getAllProfiles,
    getProfileById,
    updateProfile,
    deleteProfile,
    searchProfiles,
};
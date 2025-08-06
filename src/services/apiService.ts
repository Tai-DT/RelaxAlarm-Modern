/**
 * API Service - Modern HTTP client with error handling
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  User, 
  Audiobook, 
  Podcast, 
  LoginResponse, 
  APIResponse,
  PaginatedResponse,
} from '../types';

class APIService {
  private client: AxiosInstance;
  private baseURL = 'https://api.relaxalarm.com'; // Replace with your API URL
  
  constructor() {
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    this.setupInterceptors();
  }
  
  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    
    // Response interceptor - Handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, clear auth data
          await AsyncStorage.multiRemove(['auth_token', 'user_data']);
          // Navigate to login - you might want to use a navigation service here
        }
        return Promise.reject(error);
      }
    );
  }
  
  // Auth endpoints
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/login', {
      email,
      password,
    });
    return response.data;
  }
  
  async register(email: string, password: string, name: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>('/auth/register', {
      email,
      password,
      name,
    });
    return response.data;
  }
  
  async logout(): Promise<void> {
    await this.client.post('/auth/logout');
  }
  
  async refreshToken(): Promise<{ token: string }> {
    const response = await this.client.post<{ token: string }>('/auth/refresh');
    return response.data;
  }
  
  // User endpoints
  async getProfile(): Promise<User> {
    const response = await this.client.get<APIResponse<User>>('/user/profile');
    return response.data.data;
  }
  
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await this.client.put<APIResponse<User>>('/user/profile', data);
    return response.data.data;
  }
  
  // Audiobooks endpoints
  async getAudiobooks(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Audiobook>> {
    const response = await this.client.get<PaginatedResponse<Audiobook>>('/audiobooks', {
      params,
    });
    return response.data;
  }
  
  async getAudiobook(id: string): Promise<Audiobook> {
    const response = await this.client.get<APIResponse<Audiobook>>(`/audiobooks/${id}`);
    return response.data.data;
  }
  
  async getAudiobookCategories(): Promise<string[]> {
    const response = await this.client.get<APIResponse<string[]>>('/audiobooks/categories');
    return response.data.data;
  }
  
  // Podcasts endpoints
  async getPodcasts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  }): Promise<PaginatedResponse<Podcast>> {
    const response = await this.client.get<PaginatedResponse<Podcast>>('/podcasts', {
      params,
    });
    return response.data;
  }
  
  async getPodcast(id: string): Promise<Podcast> {
    const response = await this.client.get<APIResponse<Podcast>>(`/podcasts/${id}`);
    return response.data.data;
  }
  
  async getPodcastEpisodes(id: string, params?: {
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<any>> {
    const response = await this.client.get<PaginatedResponse<any>>(
      `/podcasts/${id}/episodes`,
      { params }
    );
    return response.data;
  }
  
  // Favorites endpoints
  async getFavorites(): Promise<(Audiobook | Podcast)[]> {
    const response = await this.client.get<APIResponse<(Audiobook | Podcast)[]>>('/user/favorites');
    return response.data.data;
  }
  
  async addToFavorites(contentId: string, contentType: 'audiobook' | 'podcast'): Promise<void> {
    await this.client.post('/user/favorites', {
      contentId,
      contentType,
    });
  }
  
  async removeFromFavorites(contentId: string): Promise<void> {
    await this.client.delete(`/user/favorites/${contentId}`);
  }
  
  // Progress tracking
  async updateProgress(contentId: string, progress: {
    position: number;
    duration: number;
    completed?: boolean;
  }): Promise<void> {
    await this.client.post(`/user/progress/${contentId}`, progress);
  }
  
  async getProgress(contentId: string): Promise<{
    position: number;
    duration: number;
    completed: boolean;
    lastPlayed: string;
  }> {
    const response = await this.client.get(`/user/progress/${contentId}`);
    return response.data.data;
  }
  
  // Sleep tracking
  async getSleepSessions(params?: {
    startDate?: string;
    endDate?: string;
    limit?: number;
  }): Promise<any[]> {
    const response = await this.client.get('/sleep/sessions', { params });
    return response.data.data;
  }
  
  async createSleepSession(session: {
    startTime: string;
    endTime: string;
    quality: number;
    notes?: string;
  }): Promise<any> {
    const response = await this.client.post('/sleep/sessions', session);
    return response.data.data;
  }
  
  // Subscription
  async getSubscriptionStatus(): Promise<{
    active: boolean;
    plan: string;
    expiresAt: string;
  }> {
    const response = await this.client.get('/user/subscription');
    return response.data.data;
  }
  
  async createSubscription(planId: string): Promise<{
    paymentUrl: string;
    subscriptionId: string;
  }> {
    const response = await this.client.post('/subscription/create', { planId });
    return response.data.data;
  }
  
  // Generic request method
  async request<T>(config: AxiosRequestConfig): Promise<T> {
    const response = await this.client.request<T>(config);
    return response.data;
  }
}

// Singleton instance
export const apiService = new APIService();
export default apiService;
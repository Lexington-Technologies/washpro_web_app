import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from './store';
import { BASE_URL } from './config';

export interface ApiResponse<T> {
  ok: boolean;
  data?: T;
  message?: string;
}

class ApiController {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = this.createAxiosInstance();
    this.initializeResponseInterceptor();
  }

  private createAxiosInstance(): AxiosInstance {
    const token = useAuthStore.getState().token;

    return axios.create({
      baseURL: BASE_URL,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  private updateToken() {
    const token = useAuthStore.getState().token;
    this.axiosInstance.defaults.headers['Authorization'] = `Bearer ${token}`;
  }

  private initializeResponseInterceptor() {
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config;

        // Check if the error is due to an expired token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh the token
            await this.refreshToken();
            // Update the token in the headers
            this.updateToken();
            // Retry the original request
            return this.axiosInstance(originalRequest);
          } catch (refreshError) {
            // If token refresh fails, log out the user
            useAuthStore.getState().logout();
            throw new Error('Session expired. Please log in again.');
          }
        }

        // Handle custom error messages from backend
        const backendMessage = error.response?.data?.message;
        if (backendMessage) {
          // If there's a custom error message, throw it as an error
          throw new Error(backendMessage);
        }

        // If no custom message is provided, fallback to Axios error message
        return Promise.reject(error);
      }
    );
  }


  private async refreshToken(): Promise<void> {
    const { refreshToken, logIn } = useAuthStore.getState();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      // Replace with the actual API endpoint and request body for refreshing the token
      const response: AxiosResponse<ApiResponse<{ token: string; refreshToken: string }>> = await axios.post(
       `${BASE_URL}/auth/refresh-token`,
        { refreshToken }
      );

      if (response.data.ok) {
        const { token, refreshToken: newRefreshToken } = response.data.data!;
        logIn({ ...useAuthStore.getState().user! }, token, newRefreshToken); 
      } else {
        throw new Error(response.data.message || 'Failed to refresh token');
      }
    } catch (error) {
      throw new Error('Unable to refresh token');
    }
  }

  async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    endpoint: string,
    data?: any,
    params?: any
  ): Promise<T> {
    this.updateToken(); // Ensure the token is up-to-date before each request

    try {
      const response: AxiosResponse<ApiResponse<T>> = await this.axiosInstance({
        method,
        url: endpoint,
        data,
        params,
      });
      // Check if response is successful
      if (response.data.ok) {
        return response.data.data as T; // Return the data
      } else {
        // Throw an error with the message from the server
        throw new Error(response.data.message || 'An error occurred');
      }
    } catch (error) {
      throw error;
    }
  }

  // Helper methods for specific HTTP verbs
  async get<T>(endpoint: string, params?: any): Promise<T> {
    return this.request<T>('get', endpoint, undefined, params);
  }

  async post<T>(endpoint: string, data?: any, p0?: { headers: { 'Content-Type': string; }; }): Promise<T> {
    return this.request<T>('post', endpoint, data);
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('put', endpoint, data);
  }

  async delete<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>('delete', endpoint, data);
  }
}

export const apiController = new ApiController();
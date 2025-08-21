import api from './api';

export interface User {
  id: string;
  username: string;
  email: string;
  registeredAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface LoginCredentials {
  emailOrUsername: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
}

class AuthService {
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', credentials);
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem('authToken', token);
      localStorage.setItem('chineseLearningUser', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;
      
      // Store token and user
      localStorage.setItem('authToken', token);
      localStorage.setItem('chineseLearningUser', JSON.stringify(user));
      
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  }

  async getProfile(): Promise<User> {
    try {
      const response = await api.get('/auth/profile');
      return response.data.user;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to get profile');
    }
  }

  async verifyToken(): Promise<User | null> {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return null;

      const response = await api.get('/auth/verify');
      return response.data.user;
    } catch (error) {
      // Token is invalid, clear it
      localStorage.removeItem('authToken');
      localStorage.removeItem('chineseLearningUser');
      return null;
    }
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('chineseLearningUser');
  }

  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('chineseLearningUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        console.error('Error parsing user from localStorage:', error);
        localStorage.removeItem('chineseLearningUser');
      }
    }
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }
}

export default new AuthService();
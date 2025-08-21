import React, { createContext, useContext, useState, useEffect } from 'react';
import authService, { User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (emailOrUsername: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing user on app start
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser && authService.getToken()) {
          // Verify token is still valid
          const verifiedUser = await authService.verifyToken();
          if (verifiedUser) {
            setUser(verifiedUser);
          } else {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.register({ username, email, password });
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (emailOrUsername: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ emailOrUsername, password });
      setUser(response.user);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
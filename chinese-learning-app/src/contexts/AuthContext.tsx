import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  registeredAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
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

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('chineseLearningUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
        localStorage.removeItem('chineseLearningUser');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('chineseLearningUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('chineseLearningUser');
    }
  }, [user]);

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate registration with localStorage
      
      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('chineseLearningUsers') || '[]');
      const userExists = existingUsers.some((u: User) => u.username === username || u.email === email);
      
      if (userExists) {
        return false; // User already exists
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        registeredAt: new Date().toISOString()
      };

      // Save user credentials (in real app, password would be hashed on server)
      const userCredentials = {
        username,
        email,
        password: btoa(password), // Simple base64 encoding for demo
        user: newUser
      };

      // Save to "database" (localStorage)
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('chineseLearningUsers', JSON.stringify(updatedUsers));
      
      const credentials = JSON.parse(localStorage.getItem('chineseLearningCredentials') || '[]');
      credentials.push(userCredentials);
      localStorage.setItem('chineseLearningCredentials', JSON.stringify(credentials));

      // Auto-login after registration
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // In a real app, this would be an API call
      const credentials = JSON.parse(localStorage.getItem('chineseLearningCredentials') || '[]');
      const userCredential = credentials.find(
        (cred: any) => 
          (cred.username === username || cred.email === username) && 
          cred.password === btoa(password)
      );

      if (userCredential) {
        setUser(userCredential.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
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
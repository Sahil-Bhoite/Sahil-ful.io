import React, { createContext, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    // Trim whitespace from credentials
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    
    if (trimmedUsername === 'demo' && trimmedPassword === 'demo') {
      setIsAuthenticated(true);
      navigate('/dashboard');
      toast.success('Successfully logged in!');
    } else {
      toast.error('Invalid credentials. Use demo/demo to login');
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    navigate('/');
    toast.success('Successfully logged out!');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
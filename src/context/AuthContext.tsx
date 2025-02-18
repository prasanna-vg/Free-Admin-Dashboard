import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('AuthProvider useEffect: token', token); // Debugging log
    if (token) {
      setIsLoggedIn(true);
      console.log('AuthProvider useEffect: isLoggedIn set to true'); // Debugging log
    } else {
      console.log('AuthProvider useEffect: no token found'); // Debugging log
    }
    setLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('authToken', token);
    setIsLoggedIn(true);
    console.log('AuthProvider login: isLoggedIn set to true'); // Debugging log
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    console.log('AuthProvider logout: isLoggedIn set to false'); // Debugging log
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {!loading && children}
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
// AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextProps {
  user: { username: string } | null;
  login: (user: { username: string }) => void;
  logout: () => void;
  setIntendedDestination: (path: string) => void;
  getIntendedDestination: () => string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{  username: string } | null>(null);
  const [intendedDestination, setIntendedDestination] = useState<string | null>(null);

  const login = (userData: {  username: string }) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const getIntendedDestination = () => {
    return intendedDestination;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setIntendedDestination, getIntendedDestination }}>
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

"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type UserRole = 'client' | 'admin' | null;

interface AuthContextType {
  user: any;
  role: UserRole;
  login: (role: UserRole, data: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('drivedeal_user');
    const storedRole = localStorage.getItem('drivedeal_role') as UserRole;
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole);
    }
  }, []);

  const login = (newRole: UserRole, data: any) => {
    setUser(data);
    setRole(newRole);
    localStorage.setItem('drivedeal_user', JSON.stringify(data));
    localStorage.setItem('drivedeal_role', newRole || '');
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    localStorage.removeItem('drivedeal_user');
    localStorage.removeItem('drivedeal_role');
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};



import { createContext, useContext, useMemo, useState } from 'react';
import { getMe, login as loginRequest, register as registerRequest } from '../services/authService.js';

const AuthContext = createContext(null);

const readStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem('jat_user')) || null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(localStorage.getItem('jat_token'));

  const persistSession = ({ user: nextUser, token: nextToken }) => {
    localStorage.setItem('jat_user', JSON.stringify(nextUser));
    localStorage.setItem('jat_token', nextToken);
    setUser(nextUser);
    setToken(nextToken);
  };

  const login = async (payload) => {
    const data = await loginRequest(payload);
    persistSession(data);
    return data;
  };

  const register = async (payload) => {
    const data = await registerRequest(payload);
    persistSession(data);
    return data;
  };

  const refreshUser = async () => {
    const data = await getMe();
    localStorage.setItem('jat_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('jat_user');
    localStorage.removeItem('jat_token');
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      refreshUser
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);


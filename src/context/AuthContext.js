import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebaseConfig';
import { authAPI, errText } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const persist = useCallback((token, u) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(u));
    setUser(u);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    const token = localStorage.getItem('access_token');
    if (stored && token) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
      authAPI.me()
        .then((r) => { setUser(r.data); localStorage.setItem('user', JSON.stringify(r.data)); })
        .catch(() => logout())
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, [logout]);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    persist(data.access_token, data.user);
    return data.user;
  }, [persist]);

  const register = useCallback(async (payload) => {
    const { data } = await authAPI.register(payload);
    persist(data.access_token, data.user);
    return data.user;
  }, [persist]);

  const otpLogin = useCallback(async (email, code, name) => {
    const { data } = await authAPI.otpVerify({ email, code, purpose: 'login', name });
    persist(data.access_token, data.user);
    return data.user;
  }, [persist]);

  const finishPasswordReset = useCallback(async (reset_token, new_password) => {
    const { data } = await authAPI.passwordReset({ reset_token, new_password });
    persist(data.access_token, data.user);
    return data.user;
  }, [persist]);

  const googleLogin = useCallback(async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;
    let idToken = null;
    try { idToken = await fbUser.getIdToken(); } catch { /* ignore */ }
    const { data } = await authAPI.google({
      email: fbUser.email,
      name: fbUser.displayName || 'User',
      profile_picture: fbUser.photoURL,
      token: idToken,
    });
    persist(data.access_token, data.user);
    return data.user;
  }, [persist]);

  const refresh = useCallback(async () => {
    try {
      const r = await authAPI.me();
      setUser(r.data);
      localStorage.setItem('user', JSON.stringify(r.data));
    } catch { /* ignore */ }
  }, []);

  const value = { user, ready, login, register, googleLogin, otpLogin, finishPasswordReset, logout, refresh, setUser, errText };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};

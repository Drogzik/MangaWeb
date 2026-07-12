import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  clearSession,
  getSession,
  loginUser,
  registerUser,
  saveSession,
  loginWithGoogle,
  loginWithTelegram,
} from '../services/authService';

const AuthContext = createContext(null);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authMessage, setAuthMessage] = useState({ text: '', type: 'info' });
  const googleIdentityReady = useRef(false);

  const refreshSession = useCallback(() => {
    setSession(getSession());
  }, []);

  const openAuth = useCallback((tab = 'login') => {
    if (getSession()) return;
    setAuthTab(tab);
    setAuthMessage({ text: '', type: 'info' });
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setAuthMessage({ text: '', type: 'info' });
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setAuthMessage({ text: '', type: 'info' });
  }, []);

  const handleAuthButtonClick = useCallback(() => {
    if (getSession()) {
      logout();
      return;
    }
    openAuth('login');
  }, [logout, openAuth]);

  const finishAuth = useCallback((user, message = 'Готово, вы вошли в аккаунт.') => {
    saveSession(user, true);
    setSession(getSession());
    setAuthMessage({ text: message, type: 'success' });
    setTimeout(closeAuth, 700);
  }, [closeAuth]);

  const handleRegister = useCallback(async (data) => {
    const user = await registerUser(data);
    finishAuth(user, 'Аккаунт создан. Добро пожаловать!');
  }, [finishAuth]);

  const handleLogin = useCallback(async (data) => {
    const user = await loginUser(data);
    setSession(getSession());
    setAuthMessage({ text: 'Вы вошли в аккаунт.', type: 'success' });
    setTimeout(closeAuth, 700);
    return user;
  }, [closeAuth]);

  const handleGoogleCredential = useCallback(async (response) => {
    try {
      if (!response?.credential) {
        setAuthMessage({ text: 'Google не вернул токен входа.', type: 'error' });
        return;
      }
      const user = await loginWithGoogle(response.credential);
      finishAuth(user, 'Вход через Google выполнен.');
    } catch (err) {
      setAuthMessage({ text: err.message || 'Ошибка входа через Google.', type: 'error' });
    }
  }, [finishAuth]);

  const initGoogleIdentity = useCallback(() => {
    if (!googleClientId) return;
    if (!window.google?.accounts?.id) return;
    if (googleIdentityReady.current) return;

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: handleGoogleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    googleIdentityReady.current = true;
  }, [handleGoogleCredential]);

  const handleGoogleClick = useCallback(() => {
    if (!googleClientId) {
      setAuthMessage({ text: 'Сначала укажите VITE_GOOGLE_CLIENT_ID в .env.', type: 'error' });
      return;
    }
    const nonce = Math.random().toString(36).substring(2);
    const redirectUri = window.location.origin;
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${googleClientId}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `response_type=id_token&` +
      `scope=openid%20email%20profile&` +
      `nonce=${nonce}`;
    window.location.href = authUrl;
  }, []);

  const handleTelegramLogin = useCallback(async (user) => {
    try {
      console.log('[TG Auth] handleTelegramLogin called with:', JSON.stringify(user));
      const dbUser = await loginWithTelegram(user);
      console.log('[TG Auth] Backend response:', JSON.stringify(dbUser));
      finishAuth(dbUser, 'Вход через Telegram выполнен.');
    } catch (err) {
      console.error('[TG Auth] Backend error:', err);
      setAuthMessage({ text: err.message || 'Ошибка входа через Telegram.', type: 'error' });
    }
  }, [finishAuth]);

  const handleSocialStub = useCallback((provider) => {
    const names = { apple: 'Apple', yandex: 'Яндекс', vk: 'ВК' };
    setAuthMessage({ text: `Вход через ${names[provider] || 'сервис'} пока только в дизайне.`, type: 'info' });
  }, []);

  useEffect(() => {
    if (!googleClientId) return undefined;
    if (window.google?.accounts?.id) {
      initGoogleIdentity();
      return undefined;
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client?hl=ru';
    script.async = true;
    script.defer = true;
    script.onload = initGoogleIdentity;
    document.head.appendChild(script);
    return () => script.remove();
  }, [initGoogleIdentity]);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const idToken = params.get('id_token');
      if (idToken) {
        // Clean URL hash
        window.history.replaceState({}, document.title, window.location.origin + window.location.pathname);
        
        // Show loading modal state
        setAuthOpen(true);
        setAuthMessage({ text: 'Выполняем вход через Google...', type: 'info' });
        
        loginWithGoogle(idToken)
          .then(user => {
            finishAuth(user, 'Вход через Google выполнен.');
          })
          .catch(err => {
            setAuthMessage({ text: err.message || 'Ошибка входа через Google.', type: 'error' });
          });
      }
    }
  }, [finishAuth]);

  const value = useMemo(() => ({
    session,
    authOpen,
    authTab,
    authMessage,
    setAuthTab,
    setAuthMessage,
    openAuth,
    closeAuth,
    logout,
    handleAuthButtonClick,
    handleRegister,
    handleLogin,
    handleGoogleClick,
    handleTelegramLogin,
    handleSocialStub,
    refreshSession,
  }), [
    session, authOpen, authTab, authMessage, openAuth, closeAuth, logout,
    handleAuthButtonClick, handleRegister, handleLogin, handleGoogleClick,
    handleTelegramLogin, handleSocialStub, refreshSession,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

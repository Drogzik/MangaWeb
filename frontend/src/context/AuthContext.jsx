import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import {
  clearSession,
  getSession,
  loginUser,
  registerUser,
  saveSession,
  loginWithGoogle,
  loginWithTelegram,
  initTelegramAuth,
  checkTelegramAuthStatus,
} from '../services/authService';

const AuthContext = createContext(null);

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID?.trim() || '';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getSession());
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState('login');
  const [authMessage, setAuthMessage] = useState({ text: '', type: 'info' });
  const googleIdentityReady = useRef(false);

  const [pendingUser, setPendingUser] = useState(null);

  const refreshSession = useCallback(() => {
    setSession(getSession());
  }, []);

  const openAuth = useCallback((tab = 'login') => {
    if (getSession()) return;
    setAuthTab(tab);
    setAuthMessage({ text: '', type: 'info' });
    setPendingUser(null);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => {
    setAuthOpen(false);
    setAuthMessage({ text: '', type: 'info' });
    setPendingUser(null);
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
    // Instead of finishing auth immediately, we go to verification step
    // We can just simulate the user object for the verification UI
    const user = { username: data.username || data.email.split('@')[0], email: data.email, ...data };
    setPendingUser(user);
    setAuthTab('verify');
    setAuthMessage({ text: 'Код отправлен на почту.', type: 'info' });
  }, []);

  const handleVerify = useCallback(async (code) => {
    if (code.length < 6) throw new Error('Код должен состоять из 6 цифр');
    
    // Временная заглушка: принимаем только код 123456
    if (code !== '123456') {
      throw new Error('Неверный код верификации. Попробуйте 123456');
    }

    // Simulate API verification call
    const user = await registerUser(pendingUser);
    finishAuth(user, 'Аккаунт подтверждён и создан!');
  }, [pendingUser, finishAuth]);

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

  const handleTelegramStart = useCallback(async () => {
    try {
      setAuthMessage({ text: 'Инициализация Telegram...', type: 'info' });
      const { code } = await initTelegramAuth();
      
      const botUrl = `https://t.me/Mangaweb_DT_bot?start=${code}`;
      window.open(botUrl, '_blank');
      
      setAuthMessage({ text: 'Откройте бота и нажмите Start/Запустить...', type: 'info' });

      // Poll for status
      const pollTimer = setInterval(async () => {
        try {
          const status = await checkTelegramAuthStatus(code);
          if (status && status.confirmed) {
            clearInterval(pollTimer);
            finishAuth(status, 'Вход через Telegram выполнен.');
          }
        } catch (err) {
          clearInterval(pollTimer);
          setAuthMessage({ text: 'Ошибка проверки статуса.', type: 'error' });
        }
      }, 2000);

      // Timeout after 5 minutes (300000 ms)
      setTimeout(() => {
        clearInterval(pollTimer);
        setAuthMessage({ text: 'Время ожидания авторизации истекло.', type: 'error' });
      }, 300000);

    } catch (err) {
      console.error('[TG Auth] Error:', err);
      setAuthMessage({ text: err.message || 'Ошибка запуска Telegram.', type: 'error' });
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

  // Removed legacy postMessage listener

  const value = useMemo(() => ({
    session,
    authOpen,
    authTab,
    authMessage,
    pendingUser,
    setAuthTab,
    setAuthMessage,
    openAuth,
    closeAuth,
    logout,
    handleAuthButtonClick,
    handleRegister,
    handleVerify,
    handleLogin,
    handleGoogleClick,
    handleTelegramStart,
    handleSocialStub,
    refreshSession,
  }), [
    session, authOpen, authTab, authMessage, pendingUser, openAuth, closeAuth, logout,
    handleAuthButtonClick, handleRegister, handleVerify, handleLogin, handleGoogleClick,
    handleTelegramStart, handleSocialStub, refreshSession,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

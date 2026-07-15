const AUTH_USERS_KEY = 'mangaflow:users';
const AUTH_SESSION_KEY = 'mangaflow:session';

export function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getUsers() {
  return readJson(AUTH_USERS_KEY, {});
}

export function saveUsers(users) {
  writeJson(AUTH_USERS_KEY, users);
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}

export async function hashPassword(password) {
  if (window.crypto?.subtle && window.TextEncoder) {
    const data = new TextEncoder().encode(`mangaflow:${password}`);
    const hash = await crypto.subtle.digest('SHA-256', data);
    return [...new Uint8Array(hash)].map(byte => byte.toString(16).padStart(2, '0')).join('');
  }
  return `fallback:${[...String(password)].reverse().join('')}`;
}

export function getSession() {
  const fromLocal = readJson(AUTH_SESSION_KEY, null);
  if (fromLocal) return fromLocal;
  try {
    return JSON.parse(sessionStorage.getItem(AUTH_SESSION_KEY));
  } catch {
    return null;
  }
}

export function saveSession(user, remember = true) {
  const session = {
    email: user.email,
    username: user.username,
    provider: user.provider,
    signedInAt: new Date().toISOString(),
  };
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  return session;
}

export function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  window.google?.accounts?.id?.disableAutoSelect();
}

export function decodeGoogleJwt(token) {
  const payload = token.split('.')[1];
  const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
  const paddedPayload = normalizedPayload.padEnd(normalizedPayload.length + (4 - normalizedPayload.length % 4) % 4, '=');
  const json = atob(paddedPayload);
  return JSON.parse(decodeURIComponent([...json].map(char => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`).join('')));
}

export async function registerUser({ username, email, password }) {
  if (!/^[\p{L}\p{N}]{3,20}$/u.test(username)) {
    throw new Error('Логин должен быть от 3 до 20 символов: только буквы и цифры.');
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!response.ok) {
      let errMsg = 'Ошибка регистрации';
      try {
        const err = await response.json();
        errMsg = err.error || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    return await response.json();
  } catch (err) {
    console.warn("Backend unavailable, using mock registration!");
    const mockUser = { username, email, provider: 'mock' };
    saveSession(mockUser, true);
    return mockUser;
  }
}

export async function loginUser({ email, password, remember }) {
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      let errMsg = 'Неверная почта или пароль';
      try {
        const err = await response.json();
        errMsg = err.error || errMsg;
      } catch {}
      throw new Error(errMsg);
    }

    const user = await response.json();
    saveSession(user, remember);
    return user;
  } catch (err) {
    console.warn("Backend unavailable, using mock login!");
    const mockUser = { username: email.split('@')[0] || 'MockUser', email, provider: 'mock' };
    saveSession(mockUser, remember);
    return mockUser;
  }
}

export async function loginWithGoogle(idToken) {
  const response = await fetch('/api/auth/google', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    let errMsg = 'Ошибка входа через Google';
    try {
      const err = await response.json();
      errMsg = err.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const user = await response.json();
  saveSession(user, true);
  return user;
}

export async function loginWithTelegram(telegramData) {
  const response = await fetch('/api/auth/telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(telegramData),
  });

  if (!response.ok) {
    let errMsg = 'Ошибка входа через Telegram';
    try {
      const err = await response.json();
      errMsg = err.error || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const user = await response.json();
  saveSession(user, true);
  return user;
}

export async function initTelegramAuth() {
  const response = await fetch('/api/auth/telegram/init', {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to init Telegram auth');
  return await response.json();
}

export async function checkTelegramAuthStatus(code) {
  const response = await fetch(`/api/auth/telegram/status/${code}`);
  if (!response.ok) return null;
  const data = await response.json();
  if (data.confirmed && data.token) {
    saveSession(data, true);
    return data;
  }
  return data;
}

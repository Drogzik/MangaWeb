import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import SocialButtons from './SocialButtons';
import StarfieldCanvas from './StarfieldCanvas';

function PasswordField({ id, name, placeholder, autoComplete, minLength, required }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="auth-input-wrap">
      <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor">
        <path d="m336 512h-288c-26.453125 0-48-21.523438-48-48v-224c0-26.476562 21.546875-48 48-48h288c26.453125 0 48 21.523438 48 48v224c0 26.476562-21.546875 48-48 48zm-288-288c-8.8125 0-16 7.167969-16 16v224c0 8.832031 7.1875 16 16 16h288c8.8125 0 16-7.167969 16-16v-224c0-8.832031-7.1875-16-16-16zm0 0" />
        <path d="m304 224c-8.832031 0-16-7.167969-16-16v-80c0-52.929688-43.070312-96-96-96s-96 43.070312-96 96v80c0 8.832031-7.167969 16-16 16s-16-7.167969-16-16v-80c0-70.59375 57.40625-128 128-128s128 57.40625 128 128v80c0 8.832031-7.167969 16-16 16zm0 0" />
      </svg>
      <input
        id={id}
        type={visible ? 'text' : 'password'}
        className="auth-input"
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
      />
      <button type="button" className="auth-toggle-pw" onClick={() => setVisible(v => !v)}>
        <svg width="18" height="18" viewBox="0 0 576 512" fill="currentColor">
          <path d="M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z" />
        </svg>
      </button>
    </div>
  );
}

export default function AuthModal() {
  const {
    authOpen,
    authTab,
    authMessage,
    closeAuth,
    setAuthTab,
    setAuthMessage,
    handleRegister,
    handleLogin,
    handleGoogleClick,
    handleSocialStub,
  } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && authOpen) closeAuth();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [authOpen, closeAuth]);

  const onLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    data.remember = form.remember?.checked;
    try {
      setLoading(true);
      await handleLogin(data);
      form.reset();
    } catch (err) {
      setAuthMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const onRegister = async (e) => {
    e.preventDefault();
    const form = e.target;
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    try {
      setLoading(true);
      await handleRegister(data);
      form.reset();
    } catch (err) {
      setAuthMessage({ text: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`auth-overlay${authOpen ? ' auth-overlay--open' : ''}`}>
      <div className="auth-overlay__backdrop" onClick={closeAuth}>
        {authOpen && <StarfieldCanvas />}
      </div>
      <div className={`auth-modal${authTab === 'register' ? ' auth-modal--register' : ''}`}>
        <button type="button" className="auth-modal__close" onClick={closeAuth}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12" /></svg>
        </button>

        <h2 className="auth-modal__title">{authTab === 'login' ? 'Вход' : 'Регистрация'}</h2>
        <p className="auth-modal__subtitle">
          Создайте аккаунт, чтобы сохранять закладки, историю чтения и получать уведомления о новых главах.
        </p>

        <form className={`auth-form${authTab === 'login' ? ' auth-form--active' : ''}`} onSubmit={onLogin}>
          <div className="auth-field">
            <label htmlFor="login-email">Почта</label>
            <div className="auth-input-wrap">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></svg>
              <input id="login-email" type="email" className="auth-input" name="email" placeholder="Введите почту" autoComplete="email" required />
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="login-password">Пароль</label>
            <PasswordField id="login-password" name="password" placeholder="Введите пароль" autoComplete="current-password" required />
          </div>
          <div className="auth-row">
            <label className="auth-remember">
              <input type="checkbox" name="remember" />
              <span className="auth-check" />
              <span>Запомнить меня</span>
            </label>
            <span className="auth-link">Забыли пароль?</span>
          </div>
          <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Проверяем...' : 'Войти'}</button>
          <p className="auth-switch">
            Нет аккаунта? <span className="auth-link" onClick={() => setAuthTab('register')}>Зарегистрироваться</span>
          </p>
          <p className="auth-divider">Или через</p>
          <SocialButtons onGoogle={handleGoogleClick} onSocial={handleSocialStub} />
        </form>

        <form className={`auth-form${authTab === 'register' ? ' auth-form--active' : ''}`} onSubmit={onRegister}>
          <div className="auth-field">
            <label htmlFor="reg-username">Логин</label>
            <div className="auth-input-wrap">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="5" /><path d="M20 21a8 8 0 0 0-16 0" /></svg>
              <input id="reg-username" type="text" className="auth-input" name="username" placeholder="Придумайте уникальный логин" autoComplete="username" minLength={3} maxLength={20} required />
            </div>
            <span className="auth-hint">От 3 до 20 символов, только буквы и цифры</span>
          </div>
          <div className="auth-field">
            <label htmlFor="reg-email">Почта</label>
            <div className="auth-input-wrap">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor"><path d="m30.853 13.87a15 15 0 0 0 -29.729 4.082 15.1 15.1 0 0 0 12.876 12.918 15.6 15.6 0 0 0 2.016.13 14.85 14.85 0 0 0 7.715-2.145 1 1 0 1 0 -1.031-1.711 13.007 13.007 0 1 1 5.458-6.529 2.149 2.149 0 0 1 -4.158-.759v-10.856a1 1 0 0 0 -2 0v1.726a8 8 0 1 0 .2 10.325 4.135 4.135 0 0 0 7.83.274 15.2 15.2 0 0 0 .823-7.455zm-14.853 8.13a6 6 0 1 1 6-6 6.006 6.006 0 0 1 -6 6z" /></svg>
              <input id="reg-email" type="email" className="auth-input" name="email" placeholder="example@mail.com" autoComplete="email" required />
            </div>
          </div>
          <div className="auth-field">
            <label htmlFor="reg-password">Пароль</label>
            <PasswordField id="reg-password" name="password" placeholder="Минимум 8 символов" autoComplete="new-password" minLength={8} required />
          </div>
          <div className="auth-field">
            <label htmlFor="reg-password-confirm">Повторите пароль</label>
            <PasswordField id="reg-password-confirm" name="passwordConfirm" placeholder="Введите пароль ещё раз" autoComplete="new-password" minLength={8} required />
          </div>
          <label className="auth-terms">
            <input type="checkbox" name="terms" required />
            <span className="auth-check" />
            <span>Я принимаю <a href="#" className="auth-link" onClick={e => e.preventDefault()}>правила сайта</a> и <a href="#" className="auth-link" onClick={e => e.preventDefault()}>политику конфиденциальности</a></span>
          </label>
          <button type="submit" className="auth-submit" disabled={loading}>{loading ? 'Проверяем...' : 'Создать аккаунт'}</button>
          <p className="auth-switch">
            Уже есть аккаунт? <span className="auth-link" onClick={() => setAuthTab('login')}>Войти</span>
          </p>
          <p className="auth-divider">Или через</p>
          <SocialButtons onGoogle={handleGoogleClick} onSocial={handleSocialStub} />
        </form>

        {authMessage.text && (
          <p className={`auth-message auth-message--visible auth-message--${authMessage.type}`} role="status">
            {authMessage.text}
          </p>
        )}
      </div>
    </div>
  );
}

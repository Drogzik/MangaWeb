import React, { useEffect, useRef, useCallback } from 'react';

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const AppleIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
  </svg>
);

const YandexIcon = () => (
  <svg viewBox="0 0 24 24">
    <rect width="24" height="24" rx="6" fill="#FC3F1D" />
    <text x="12" y="17" textAnchor="middle" fill="#fff" fontFamily="Arial, Helvetica, sans-serif" fontSize="14" fontWeight="700">Я</text>
  </svg>
);

const VkIcon = () => (
  <svg viewBox="0 0 24 24">
    <path fill="#0077FF" d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.118-5.335-3.202C4.624 10.857 4.03 8.57 4.03 8.096c0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.203.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.813-.542 1.254-1.406 2.151-3.574 2.151-3.574.119-.254.322-.491.763-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.165-2.354 4.165-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z" />
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24">
    <path fill="#26A5E4" d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.099.155.232.171.326.016.094.036.308.02.475z" />
  </svg>
);

const providers = [
  { id: 'google', label: 'Google', Icon: GoogleIcon },
  { id: 'apple', label: 'Apple', Icon: AppleIcon },
  { id: 'yandex', label: 'Яндекс', Icon: YandexIcon },
  { id: 'vk', label: 'ВК', Icon: VkIcon },
  { id: 'telegram', label: 'Telegram', Icon: TelegramIcon },
];

const BOT_USERNAME = 'Mangaweb_DT_bot';

export default function SocialButtons({ onGoogle, onSocial, onTelegram }) {
  // Listen for postMessage from Telegram auth popup
  useEffect(() => {
    const handler = (e) => {
      if (e.origin === 'https://oauth.telegram.org' && e.data && e.data.event === 'auth_result') {
        if (e.data.result && onTelegram) {
          onTelegram(e.data.result);
        }
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onTelegram]);

  const handleTelegramClick = useCallback(() => {
    const botId = BOT_USERNAME;
    const origin = window.location.origin;
    const w = 550, h = 470;
    const left = Math.round(window.screenX + (window.outerWidth - w) / 2);
    const top = Math.round(window.screenY + (window.outerHeight - h) / 2);
    const url = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${encodeURIComponent(origin)}&request_access=write&return_to=${encodeURIComponent(origin)}`;
    window.open(url, 'telegram_auth', `width=${w},height=${h},left=${left},top=${top}`);
  }, []);

  return (
    <div className="auth-social">
      <div className="auth-social__row">
        {providers.slice(0, 2).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className="auth-social-btn"
            onClick={() => (id === 'google' ? onGoogle() : onSocial(id))}
          >
            <span className="auth-social-btn__icon" aria-hidden="true"><Icon /></span>
            {label}
          </button>
        ))}
      </div>
      <div className="auth-social__row auth-social__row--triple">
        {providers.slice(2).map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className="auth-social-btn"
            onClick={() => {
              if (id === 'telegram') {
                handleTelegramClick();
              } else {
                onSocial(id);
              }
            }}
          >
            <span className="auth-social-btn__icon" aria-hidden="true"><Icon /></span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}


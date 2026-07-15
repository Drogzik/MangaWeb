import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import './UserMenu.css';

const BookmarkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
);

const FriendsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
);

const MessageIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
);

const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
);

const LogoutIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
);

const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
)

export default function UserMenu() {
  const navigate = useNavigate();
  const { session, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const [avatarSrc, setAvatarSrc] = useState(() => localStorage.getItem('profileAvatar') || session?.avatar || '/default_avatar.jpg');

  useEffect(() => {
    const handleStorageChange = () => {
      setAvatarSrc(localStorage.getItem('profileAvatar') || session?.avatar || '/default_avatar.jpg');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleStorageChange);
    };
  }, [session]);

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <button className="user-menu-icon-btn" title="Закладки">
        <BookmarkIcon />
      </button>
      <button className="user-menu-icon-btn" title="Уведомления">
        <BellIcon />
      </button>
      
      <button className="user-menu-avatar-btn" onClick={() => setIsOpen(!isOpen)}>
        <img src={avatarSrc} alt="Avatar" />
      </button>

      {isOpen && (
        <div className="user-dropdown-menu">
          <div className="user-dropdown-header" onClick={() => handleNavigation('/profile')}>
            <img src={avatarSrc} alt="Avatar" />
            <div className="user-dropdown-info">
              <span className="user-dropdown-name">{session?.username}</span>
              <span className="user-dropdown-sub">Мой профиль</span>
            </div>
            <div className="user-dropdown-chevron">
              <ChevronRight />
            </div>
          </div>
          
          <ul className="user-dropdown-list">
            <li>
              <button onClick={() => handleNavigation('/settings')}>
                <SettingsIcon />
                <span>Настройки</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/friends')}>
                <FriendsIcon />
                <span>Друзья</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleNavigation('/messages')}>
                <MessageIcon />
                <span>Сообщения</span>
              </button>
            </li>
            <li>
              <button onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}>
                {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
                <span>Оформление ({theme === 'dark' ? 'Тёмная' : 'Светлая'})</span>
                <div className="user-dropdown-chevron" style={{ marginLeft: 'auto' }}>
                  <ChevronRight />
                </div>
              </button>
            </li>
          </ul>
          
          <div className="user-dropdown-footer">
            <button className="logout-btn" onClick={() => { logout(); setIsOpen(false); }}>
              <LogoutIcon />
              <span>Выйти</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

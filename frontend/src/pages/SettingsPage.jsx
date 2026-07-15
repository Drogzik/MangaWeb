import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './SettingsPage.module.css';

const UserTabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm4 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm4 8h6v-2h-6v2zm0-4h6v-2h-6v2z" />
  </svg>
);

const PaletteTabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 14c-1.66 0-3 1.34-3 3 0 1.31-1.16 2-2 2 .92 1.22 2.49 2 4 2 2.21 0 4-1.79 4-4 0-1.66-1.34-3-3-3zm13.71-9.37l-1.34-1.34a2 2 0 0 0-2.83 0L9 10.83l4.17 4.17 7.54-7.54a2 2 0 0 0 0-2.83z" />
  </svg>
);

const BellTabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 12h-4c0 1.66-1.35 3-3 3s-3-1.34-3-3H5V5h14v10z" />
  </svg>
);

const FilterTabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 4c0-.55.45-1 1-1h16c.55 0 1 .45 1 1v1.5c0 .28-.11.54-.31.73L14 13v6c0 .55-.45 1-1 1h-2c-.55 0-1-.45-1-1v-6L3.31 6.23C3.11 6.04 3 5.78 3 5.5V4z" />
  </svg>
);

const BookmarksTabIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-8 11-4-4h2.5v-3h3v3H16l-4 4z" />
  </svg>
);

const TABS = [
  { id: 'personal', label: 'Личные данные', icon: <UserTabIcon /> },
  { id: 'appearance', label: 'Внешний вид', icon: <PaletteTabIcon /> },
  { id: 'notifications', label: 'Уведомления', icon: <BellTabIcon /> },
  { id: 'filters', label: 'Фильтр контента', icon: <FilterTabIcon /> }
];

const DECORATIONS = {
  avatars: [
    { id: 1, name: 'Reze (Chainsaw Man)', img: '/avatar_reze_1783959680874.jpg', type: 'avatar' },
    { id: 2, name: 'Dark Boy', img: '/avatar_1_boy_1783958087860.jpg', type: 'avatar' },
    { id: 3, name: 'Silver Girl', img: '/avatar_2_girl_1783958096727.jpg', type: 'avatar' },
    { id: 4, name: 'Mysterious', img: '/avatar_3_mysterious_1783958104874.jpg', type: 'avatar' }
  ],
  frames: [
    { id: 1, name: 'Без рамки', styleId: 'none', style: { border: 'none', boxShadow: '0 8px 30px rgba(0,0,0,0.5)' }, type: 'frame' },
    { id: 2, name: 'Золотая рамка', styleId: 'gold', style: { border: '4px solid #fbbf24', boxShadow: '0 0 20px 5px rgba(251, 191, 36, 0.4)' }, type: 'frame' },
    { id: 3, name: 'Неоновая рамка', styleId: 'neon', style: { border: '4px solid #06b6d4', boxShadow: '0 0 30px 10px rgba(6, 182, 212, 0.6)' }, type: 'frame' },
    { id: 4, name: 'Тёмная аура', styleId: 'dark', style: { border: '4px solid #1e293b', boxShadow: '0 0 40px 15px rgba(0, 0, 0, 0.8)' }, type: 'frame' }
  ],
  banners: [
    { id: 1, name: 'Cyber City', img: '/banner_1_city_1783958158072.jpg', type: 'banner' },
    { id: 2, name: 'Epic Space', img: '/banner_2_space_1783958166998.jpg', type: 'banner' },
    { id: 3, name: 'Mystic Forest', img: '/banner_3_nature_1783958177183.jpg', type: 'banner' }
  ],
  wallpapers: [
    { id: 1, name: 'Grey Theme (Default)', img: 'none', type: 'wallpaper' },
    { id: 2, name: 'Tokyo Cyberpunk', img: '/wallpaper_1_street_1783959690033.jpg', type: 'wallpaper' },
    { id: 3, name: 'Starry Sky', img: '/wallpaper_2_sky_1783959698388.jpg', type: 'wallpaper' }
  ]
};

const ALL_TAGS = [
  "Основной каст", "ГГ мужчина", "ГГ женщина", "ГГ имба", "ГГ бог", "ГГ не человек", "Антигерой", "Злодей", "Предательство", "Месть", "Система", "Исекай", "Магия", "Академия", "Боевые искусства", "Культивация", "Алхимия", "Реинкарнация", "Возвращение в прошлое", "Постапокалипсис", "Выживание", "Зомби", "Мутанты", "Киберпанк", "Стимпанк", "Космос", "Меха", "Романтика", "Гарем", "Обратный гарем", "Повседневность", "Комедия", "Драма", "Трагедия", "Психология", "Ужасы", "Триллер", "Детектив", "Мистика", "Вампиры", "Оборотни", "Демоны", "Ангелы", "Боги", "Эльфы", "Гномы", "Орки", "Драконы", "Магические звери", "Подземелья", "Башня", "Игры", "Виртуальная реальность", "Киберспорт", "Спорт", "Школа", "Политика", "Экономика", "Война", "Исторический", "Сёнэн", "Сэйнэн", "Сёдзё", "Дзёсэй", "Этти", "Юри", "Яой"
].sort();

const MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [activeDecorationTab, setActiveDecorationTab] = useState('banners');
  const [socialLinks, setSocialLinks] = useState([{ id: 1, url: '', title: '' }]);
  const [hiddenTags, setHiddenTags] = useState([]);
  const [filterSearch, setFilterSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load selected decorations from localStorage
  const [currentAvatar, setCurrentAvatar] = useState(() => localStorage.getItem('profileAvatar') || '/avatar_reze_1783959680874.jpg');
  const [currentBanner, setCurrentBanner] = useState(() => localStorage.getItem('profileBanner') || '/banner_1_city_1783958158072.jpg');
  const [currentFrame, setCurrentFrame] = useState(() => localStorage.getItem('profileFrame') || 'none');
  const [currentWallpaper, setCurrentWallpaper] = useState(() => localStorage.getItem('profileWallpaper') || 'none');

  const updateProfileAsset = (type, value) => {
    if (type === 'avatar') {
      localStorage.setItem('profileAvatar', value);
      setCurrentAvatar(value);
    } else if (type === 'banner') {
      localStorage.setItem('profileBanner', value);
      setCurrentBanner(value);
    } else if (type === 'frame') {
      localStorage.setItem('profileFrame', value);
      setCurrentFrame(value);
    } else if (type === 'wallpaper') {
      localStorage.setItem('profileWallpaper', value);
      setCurrentWallpaper(value);
    }
    window.dispatchEvent(new Event('profile-updated'));
  };

  // Check URL params for pre-selecting active tab
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tab = searchParams.get('tab');
    if (tab && TABS.some(t => t.id === tab)) {
      setActiveTab(tab);
      // Clean up URL without reloading
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const [activeSubTab, setActiveSubTab] = useState('main'); // 'main', 'account', 'integrations'
  const [showSessionsModal, setShowSessionsModal] = useState(false);

  const [genderOpen, setGenderOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState(() => localStorage.getItem('profileGender') || 'Мужской');

  const [countryOpen, setCountryOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('Не указана');

  const [dateOpen, setDateOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarView, setCalendarView] = useState('days'); // 'days' or 'years'

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    let firstDay = new Date(year, month, 1).getDay() - 1;
    if (firstDay === -1) firstDay = 6;
    return { days, firstDay };
  };

  const [profileDescription, setProfileDescription] = useState(() => localStorage.getItem('profileDescription') || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const handleSaveProfile = () => {
    localStorage.setItem('profileDescription', profileDescription);
    window.dispatchEvent(new Event('profile-updated'));
    setSaveSuccessMsg('Изменения успешно сохранены!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);
  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= days; i++) calendarDays.push(i);

  const handlePrevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  const handleNextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  
  const formatDate = (date) => {
    if (!date) return 'Выберите дату';
    return date.toLocaleDateString('ru-RU');
  };

  const filteredTags = ALL_TAGS.filter(tag => 
    tag.toLowerCase().includes(filterSearch.toLowerCase()) && 
    !hiddenTags.includes(tag)
  );

  const handleRemoveTag = (tag) => {
    setHiddenTags(hiddenTags.filter(t => t !== tag));
  };

  const handleAddSocial = () => {
    setSocialLinks([...socialLinks, { id: Date.now(), url: '', title: '' }]);
  };

  const handleRemoveSocial = (id) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  return (
    <div className={styles.settingsContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <div className={styles.sidebarHeader} onClick={() => navigate(-1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <div>
            Редактирование профиля
            <span className={styles.sidebarSubtitle}>Обновлён: недавно</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.active : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.content}>
        {activeTab === 'personal' && (
          <div>
            <div className={styles.contentHeader}>
              <button 
                className={`${styles.contentTab} ${activeSubTab === 'main' ? styles.active : ''}`}
                onClick={() => setActiveSubTab('main')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                Основные
              </button>
              <button 
                className={`${styles.contentTab} ${activeSubTab === 'account' ? styles.active : ''}`}
                onClick={() => setActiveSubTab('account')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                Аккаунт
              </button>
              <button 
                className={`${styles.contentTab} ${activeSubTab === 'integrations' ? styles.active : ''}`}
                onClick={() => setActiveSubTab('integrations')}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                Интеграции
              </button>
            </div>

            {activeSubTab === 'main' && (
              <>
                <h2 className={styles.sectionTitle}>Личные данные</h2>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Никнейм</label>
                    <input type="text" className={styles.formInput} defaultValue={session?.username || ''} />
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Пол</label>
                    <div className={styles.selectWrapper}>
                      <div 
                        className={`${styles.selectDisplay} ${genderOpen ? styles.open : ''}`}
                        onClick={() => setGenderOpen(!genderOpen)}
                      >
                        <span>{selectedGender}</span>
                        <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      {genderOpen && (
                        <div className={styles.dropdownMenu}>
                          {['Не указан', 'Мужской', 'Женский'].map(opt => (
                            <div 
                              key={opt}
                              className={styles.dropdownItem}
                              onClick={() => {
                                setSelectedGender(opt);
                                localStorage.setItem('profileGender', opt);
                                window.dispatchEvent(new Event('profile-updated'));
                                setGenderOpen(false);
                              }}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label className={styles.formLabel}>Описание</label>
                    <textarea 
                      className={styles.formTextarea} 
                      placeholder="Напишите что-нибудь..."
                      maxLength={2048}
                      value={profileDescription}
                      onChange={(e) => setProfileDescription(e.target.value)}
                    ></textarea>
                    <div className={styles.textareaFooter}>{profileDescription.length}/2048</div>
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>День рождения</label>
                    <div className={styles.datePickerWrapper}>
                      <div 
                        className={`${styles.selectDisplay} ${dateOpen ? styles.open : ''}`}
                        onClick={() => setDateOpen(!dateOpen)}
                      >
                        <span style={{ color: selectedDate ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                          {formatDate(selectedDate)}
                        </span>
                        <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                      </div>
                      
                      {dateOpen && (
                        <div className={styles.datePickerPopup}>
                          <div className={styles.calendarHeader}>
                            <button type="button" onClick={(e) => { e.stopPropagation(); calendarView === 'days' ? handlePrevMonth() : setCalendarView('days'); }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                            </button>
                            <div 
                              className={styles.calendarMonth} 
                              onClick={(e) => { e.stopPropagation(); setCalendarView(calendarView === 'days' ? 'years' : 'days'); }}
                              style={{ cursor: 'pointer' }}
                            >
                              {calendarView === 'days' ? `${MONTHS[currentMonth.getMonth()]} ${currentMonth.getFullYear()}` : 'Выбор года'}
                            </div>
                            <button type="button" style={{ visibility: calendarView === 'days' ? 'visible' : 'hidden' }} onClick={(e) => { e.stopPropagation(); handleNextMonth(); }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                            </button>
                          </div>
                          
                          {calendarView === 'days' ? (
                            <div className={styles.calendarGrid}>
                              {DAYS.map(d => <div key={d} className={styles.calendarDayName}>{d}</div>)}
                              {calendarDays.map((d, i) => (
                                <div 
                                  key={i} 
                                  className={`${styles.calendarDay} ${!d ? styles.empty : ''} ${selectedDate?.getDate() === d && selectedDate?.getMonth() === currentMonth.getMonth() && selectedDate?.getFullYear() === currentMonth.getFullYear() ? styles.selected : ''}`}
                                  onClick={() => {
                                    if (d) {
                                      setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), d));
                                      setDateOpen(false);
                                    }
                                  }}
                                >
                                  {d || ''}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className={styles.yearsGrid}>
                              {years.map(y => (
                                <div 
                                  key={y} 
                                  className={`${styles.yearItem} ${y === currentMonth.getFullYear() ? styles.selected : ''}`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentMonth(new Date(y, currentMonth.getMonth()));
                                    setCalendarView('days');
                                  }}
                                >
                                  {y}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Страна</label>
                    <div className={styles.selectWrapper}>
                      <div 
                        className={`${styles.selectDisplay} ${countryOpen ? styles.open : ''}`}
                        onClick={() => setCountryOpen(!countryOpen)}
                      >
                        <span>{selectedCountry}</span>
                        <svg className={styles.chevronIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                      {countryOpen && (
                        <div className={styles.dropdownMenu}>
                          {['Не указана', 'Россия', 'Украина', 'Беларусь', 'Казахстан'].map(opt => (
                            <div 
                              key={opt}
                              className={styles.dropdownItem}
                              onClick={() => {
                                setSelectedCountry(opt);
                                setCountryOpen(false);
                              }}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.full}`}>
                    <label className={styles.formLabel}>Ссылка на профиль</label>
                    <input type="text" className={styles.formInput} defaultValue="/users/" />
                  </div>
                </div>

                <div className={styles.socialSection}>
                  <div className={styles.socialHeader}>
                    <h3>Я в социальных сетях</h3>
                    <p>Покажи, где ты ещё есть</p>
                  </div>

                  {socialLinks.map((link) => (
                    <div key={link.id} className={styles.socialRow}>
                      <div className={styles.dragHandle}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/></svg>
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Ссылка</label>
                        <input type="text" className={styles.formInput} placeholder="https://" />
                      </div>
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Заголовок</label>
                        <input type="text" className={styles.formInput} placeholder="Я в соцсети" />
                      </div>
                      <button className={styles.btnRemove} onClick={() => handleRemoveSocial(link.id)}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  ))}

                  <button className={styles.btnAdd} onClick={handleAddSocial}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Добавить
                  </button>
                </div>

                <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                  <button className={styles.saveBtn} onClick={handleSaveProfile}>Сохранить изменения</button>
                  {saveSuccessMsg && <span style={{color: '#4ade80', fontSize: '14px', fontWeight: '500', animation: 'fadeIn 0.3s'}}>{saveSuccessMsg}</span>}
                </div>
              </>
            )}

            {activeSubTab === 'account' && (
              <div className={styles.accountSettings}>
                <div className={styles.settingsBlock}>
                  <h3>Сменить пароль</h3>
                  <div className={styles.formGrid}>
                    <div className={`${styles.formGroup} ${styles.full}`}>
                      <label className={styles.formLabel}>Текущий пароль</label>
                      <input type="password" className={styles.formInput} placeholder="••••••••" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Новый пароль</label>
                      <input type="password" className={styles.formInput} placeholder="••••••••" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Подтвердите новый пароль</label>
                      <input type="password" className={styles.formInput} placeholder="••••••••" />
                    </div>
                  </div>
                  <button className={styles.btnSecondary} style={{ width: 'fit-content' }}>Сменить</button>
                </div>

                <div className={styles.divider} />

                <div className={styles.settingsBlock}>
                  <h3>Сменить почту</h3>
                  <p className={styles.textMuted}>Текущая почта: test@mangaweb.com</p>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Новая почта</label>
                      <input type="email" className={styles.formInput} placeholder="new@example.com" />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Текущий пароль</label>
                      <input type="password" className={styles.formInput} placeholder="••••••••" />
                    </div>
                  </div>
                  <button className={styles.btnSecondary} style={{ width: 'fit-content' }}>Сменить</button>
                </div>

                <div className={styles.divider} />

                <div className={styles.twoFactorBlock}>
                  <div className={styles.twoFactorInfo}>
                    <h3>Двухфакторная аутентификация</h3>
                    <p>Чтобы её включить, скачайте Google Authenticator или Authy на своё мобильное устройство. Это значительно повысит безопасность вашего аккаунта.</p>
                  </div>
                  <button className={styles.btnPrimary}>Включить</button>
                </div>
              </div>
            )}

            {activeSubTab === 'integrations' && (
              <div className={styles.integrationsTab}>
                <div className={styles.profileHeaderBlock}>
                  <div className={styles.phAvatar}>
                    <img src={session?.avatar || '/default_avatar.jpg'} alt="Avatar" />
                  </div>
                  <div className={styles.phInfo}>
                    <h2>{session?.username || 'Tor1cks'}</h2>
                  </div>
                </div>

                <h3 className={styles.listTitle}>Популярные действия</h3>
                <div className={styles.actionList}>
                  <div className={styles.actionItem} onClick={() => setActiveSubTab('account')}>
                    <div className={styles.actionIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </div>
                    <div className={styles.actionTexts}>
                      <h4>Сменить пароль</h4>
                      <p>Был изменён 11 месяцев назад</p>
                    </div>
                    <div className={styles.actionArrow}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>
                  
                  <div className={styles.actionItem} onClick={() => setActiveSubTab('account')}>
                    <div className={styles.actionIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                    </div>
                    <div className={styles.actionTexts}>
                      <h4>Сменить почту</h4>
                      <p>Текущая: test@mangaweb.com</p>
                    </div>
                    <div className={styles.actionArrow}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>

                  <div className={styles.actionItem} onClick={() => setActiveSubTab('account')}>
                    <div className={styles.actionIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    </div>
                    <div className={styles.actionTexts}>
                      <h4>Привязать двухфакторную аутентификацию</h4>
                      <p>Дополнительная защита аккаунта</p>
                    </div>
                    <div className={styles.actionArrow}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>

                  <div className={styles.actionItem}>
                    <div className={styles.actionIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                    </div>
                    <div className={styles.actionTexts}>
                      <h4>Привязать аккаунты соц-сетей</h4>
                      <p>VK, Google, Discord</p>
                    </div>
                    <div className={styles.actionArrow}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>

                  <div className={styles.actionItem} onClick={() => setShowSessionsModal(true)}>
                    <div className={styles.actionIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                    </div>
                    <div className={styles.actionTexts}>
                      <h4>Посмотреть активные сеансы</h4>
                      <p>С каких устройств выполнен вход</p>
                    </div>
                    <div className={styles.actionArrow}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className={styles.appearanceContainer}>
            <div className={styles.profileCardPreview}>
              <div className={styles.cardBanner}>
                <img src={currentBanner} alt="Banner" />
                <div className={styles.bannerOverlay}>
                  <button className={styles.cardEditBtn}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Изменить баннер
                  </button>
                </div>
              </div>
              <div className={styles.cardProfileSection}>
                <div className={styles.cardAvatarWrapper} style={DECORATIONS.frames.find(f => f.styleId === currentFrame)?.style || {}}>
                  <img src={currentAvatar} alt="Avatar" className={styles.cardAvatar} />
                  <button className={styles.avatarEditCircBtn}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  </button>
                </div>
                <div className={styles.cardInfo}>
                  <h3 className={styles.cardName}>{session?.username || 'Tor1cks'}</h3>
                  <p className={styles.cardSub}>Предпросмотр профиля</p>
                </div>
              </div>
            </div>

            <div className={styles.appearanceSection}>
              <div className={styles.decorationsHeader}>
                <h3>Мои украшения</h3>
              </div>

              <div className={styles.decorationsTabs}>
                <button 
                  className={`${styles.decTab} ${activeDecorationTab === 'avatars' ? styles.active : ''}`}
                  onClick={() => setActiveDecorationTab('avatars')}
                >
                  Аватары
                </button>
                <button 
                  className={`${styles.decTab} ${activeDecorationTab === 'frames' ? styles.active : ''}`}
                  onClick={() => setActiveDecorationTab('frames')}
                >
                  Рамки аватара
                </button>
                <button 
                  className={`${styles.decTab} ${activeDecorationTab === 'banners' ? styles.active : ''}`}
                  onClick={() => setActiveDecorationTab('banners')}
                >
                  Баннеры
                </button>
                <button 
                  className={`${styles.decTab} ${activeDecorationTab === 'wallpapers' ? styles.active : ''}`}
                  onClick={() => setActiveDecorationTab('wallpapers')}
                >
                  Обои
                </button>
              </div>

              {DECORATIONS[activeDecorationTab] && DECORATIONS[activeDecorationTab].length > 0 ? (
                <div className={styles.decorationsGrid}>
                  {DECORATIONS[activeDecorationTab].map((item, idx) => {
                    const isActive = (item.type === 'avatar' && item.img === currentAvatar) ||
                                     (item.type === 'banner' && item.img === currentBanner) ||
                                     (item.type === 'frame' && item.styleId === currentFrame) ||
                                     (item.type === 'wallpaper' && item.img === currentWallpaper);
                    return (
                      <div 
                        key={item.id} 
                        className={`${styles.decCard} ${isActive ? styles.active : ''}`}
                        onClick={() => updateProfileAsset(item.type, item.type === 'frame' ? item.styleId : item.img)}
                      >
                        <div className={`${styles.decCardImg} ${activeDecorationTab === 'avatars' ? styles.avatar : ''} ${activeDecorationTab === 'frames' ? styles.frame : ''} ${item.img === 'none' ? styles.noImg : ''}`}>
                          {activeDecorationTab === 'frames' ? (
                            <>
                              <img src={currentAvatar} alt="Avatar" className={styles.baseAvatar} />
                              <div className={styles.frameOverlay} style={item.style}></div>
                            </>
                          ) : (
                            item.img !== 'none' ? <img src={item.img} alt={item.name} /> : <div className={styles.emptyWallpaper}></div>
                          )}
                        </div>
                        <div className={styles.decCardTitle}>{item.name}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className={styles.emptyDecorations}>
                  <div className={styles.emptyIcon}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <line x1="3" y1="9" x2="21" y2="9" />
                      <line x1="9" y1="21" x2="9" y2="9" />
                    </svg>
                  </div>
                  <p>У вас пока нет купленных элементов</p>
                  <button className={styles.shopBtn}>Перейти в магазин украшений</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {activeTab !== 'personal' && activeTab !== 'appearance' && activeTab !== 'notifications' && activeTab !== 'filters' && (
          <div className={styles.placeholderTab}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>Раздел "{TABS.find(t => t.id === activeTab)?.label}" в разработке</p>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div>
            <h2 className={styles.sectionTitle}>Настройки уведомлений</h2>
            <p className={styles.appearanceNote} style={{marginBottom: '24px'}}>Выберите уведомления которые хотите получать</p>

            <div className={styles.settingsSectionLabel}>Социальное</div>
            <div className={styles.toggleWrapper}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Лайки комментариев</span>
                <span className={styles.toggleDesc}>Уведомлять о новых лайках на комментарии</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            <div className={styles.toggleWrapper}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Ответы на комментарии</span>
                <span className={styles.toggleDesc}>Уведомлять о новых ответах на комментариях</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
            <div className={styles.toggleWrapper}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Заявки в друзья</span>
                <span className={styles.toggleDesc}>Уведомлять о новых заявках в друзья</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingsSectionLabel}>Манга и чтение</div>
            <div className={styles.toggleWrapper}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Новые главы</span>
                <span className={styles.toggleDesc}>Уведомлять о выходе новых глав из списка "Читаю"</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>

            <div className={styles.settingsSectionLabel}>Карты</div>
            <div className={styles.toggleWrapper}>
              <div className={styles.toggleInfo}>
                <span className={styles.toggleTitle}>Обмен карточек</span>
                <span className={styles.toggleDesc}>Уведомлять о новых предложениях обмена</span>
              </div>
              <label className={styles.toggleSwitch}>
                <input type="checkbox" defaultChecked />
                <span className={styles.toggleSlider}></span>
              </label>
            </div>
          </div>
        )}

        {activeTab === 'filters' && (
          <div>
            <h2 className={styles.sectionTitle}>Фильтр контента</h2>
            <p className={styles.appearanceNote} style={{marginBottom: '24px'}}>Выберите лейблы которые хотите скрыть</p>

            <div className={styles.filterControls}>
              <div className={styles.customSelectWrapper}>
                <input 
                  type="text" 
                  className={styles.filterInput} 
                  placeholder="Поиск лейблов..." 
                  value={filterSearch}
                  onChange={(e) => {
                    setFilterSearch(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                />
                <div className={styles.inputIcon}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
                
                {isDropdownOpen && filteredTags.length > 0 && (
                  <div className={styles.dropdownMenu}>
                    {filteredTags.map(tag => (
                      <div 
                        key={tag} 
                        className={styles.dropdownItem}
                        onMouseDown={(e) => {
                          e.preventDefault(); // prevent blur
                          setHiddenTags([...hiddenTags, tag]);
                          setFilterSearch('');
                          setIsDropdownOpen(false);
                        }}
                      >
                        {tag}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button 
                type="button"
                className={`${styles.clearFiltersBtn} ${hiddenTags.length > 0 ? styles.activeBtn : ''}`}
                onClick={() => setHiddenTags([])}
                disabled={hiddenTags.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                Очистить всё
              </button>
            </div>

            {hiddenTags.length > 0 ? (
              <div className={styles.tagsContainer}>
                {hiddenTags.map(tag => (
                  <div key={tag} className={styles.filterTag}>
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyFilter}>
                <div className={styles.emptyIcon}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    <polyline points="9 12 11 14 15 10"></polyline>
                  </svg>
                </div>
                <p>У вас нет скрытых лейблов. Весь контент доступен для просмотра.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {showSessionsModal && (
        <div className={styles.modalOverlay} onClick={() => setShowSessionsModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Активные сеансы</h3>
              <button className={styles.closeModal} onClick={() => setShowSessionsModal(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className={styles.sessionsList}>
              <div className={styles.sessionItem}>
                <div className={styles.sessionIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                </div>
                <div className={styles.sessionInfo}>
                  <h4>Windows · Google Chrome</h4>
                  <p>Москва, Россия · Активно сейчас</p>
                </div>
                <div className={styles.sessionBadge}>Текущий</div>
              </div>
              <div className={styles.sessionItem}>
                <div className={styles.sessionIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>
                </div>
                <div className={styles.sessionInfo}>
                  <h4>iPhone 13 · Safari</h4>
                  <p>Москва, Россия · 2 часа назад</p>
                </div>
                <button className={styles.sessionTerminate}>Завершить</button>
              </div>
            </div>
            <button className={styles.btnSecondary} style={{width: '100%', marginTop: 24, color: '#ef4444'}}>
              Завершить все другие сеансы
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

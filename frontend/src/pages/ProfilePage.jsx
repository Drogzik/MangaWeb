import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './ProfilePage.module.css';

const SvgIcon = ({ name }) => {
  switch(name) {
    case 'book': return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>;
    case 'star': return <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
    case 'cake': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8"></path><path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1"></path><path d="M2 21h20"></path><path d="M7 8v2"></path><path d="M12 8v2"></path><path d="M17 8v2"></path><path d="M7 4h.01"></path><path d="M12 4h.01"></path><path d="M17 4h.01"></path></svg>;
    case 'user': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
    case 'close': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
    case 'heart': return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>;
    case 'quote': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path></svg>;
    case 'crown': return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"></path></svg>;
    default: return null;
  }
}

const ALL_QUESTS = [
  "Прочитать 30 глав", "Оставить 5 комментариев", "Добавить 3 тайтла в библиотеку",
  "Оценить 10 тайтлов", "Зайти 7 дней подряд", "Завершить чтение 1 тайтла",
  "Добавить 1 друга", "Написать сообщение в чат", "Прочитать 100 глав",
  "Лайкнуть 20 комментариев", "Обновить статус 5 раз", "Прочитать главу ночью",
  "Оставить отзыв (рецензию)", "Сменить аватарку", "Сменить баннер",
  "Посетить 10 разных страниц манги", "Добавить тайтл в 'Брошено'",
  "Добавить тайтл в 'В планах'", "Поделиться тайтлом с другом"
].map((text, i) => ({ id: i, text, progress: Math.floor(Math.random() * 80) + 10 }));

const CHARACTERS = [
  { id: 'reze', name: 'Рэзе', type: 'waifu', img: '/avatar_reze_1783959680874.jpg', subtitle: 'Топ 1 Вайфу' },
  { id: 'silver', name: 'Айрин', type: 'waifu', img: '/avatar_2_girl_1783958096727.jpg', subtitle: 'Серебряная' },
  { id: 'boy', name: 'Со Джу Хон', type: 'husbando', img: '/avatar_1_boy_1783958087860.jpg', subtitle: 'Главный герой' },
  { id: 'myst', name: 'Годжо', type: 'husbando', img: '/avatar_3_mysterious_1783958104874.jpg', subtitle: 'Сильнейший' },
];

export default function ProfilePage() {
  const navigate = useNavigate();

  // Load from localStorage or use defaults
  const { session } = useAuth();
  const [selectedAvatar, setSelectedAvatar] = useState(() => localStorage.getItem('profileAvatar') || '/avatar_reze_1783959680874.jpg');
  const [selectedBanner, setSelectedBanner] = useState(() => localStorage.getItem('profileBanner') || '/banner_1_city_1783958158072.jpg');
  const [selectedFrame, setSelectedFrame] = useState(() => localStorage.getItem('profileFrame') || 'none');
  const [selectedWallpaper, setSelectedWallpaper] = useState(() => localStorage.getItem('profileWallpaper') || 'none');
  const [userGender, setUserGender] = useState(() => localStorage.getItem('profileGender') || 'Мужской');
  const [selectedFavCharId, setSelectedFavCharId] = useState(() => localStorage.getItem('profileFavChar') || 'reze');
  
  const [profileDescription, setProfileDescription] = useState(() => localStorage.getItem('profileDescription') || '');
  
  useEffect(() => {
    const handleStorageChange = () => {
      setSelectedAvatar(localStorage.getItem('profileAvatar') || '/avatar_reze_1783959680874.jpg');
      setSelectedBanner(localStorage.getItem('profileBanner') || '/banner_1_city_1783958158072.jpg');
      setSelectedFrame(localStorage.getItem('profileFrame') || 'none');
      setSelectedWallpaper(localStorage.getItem('profileWallpaper') || 'none');
      setUserGender(localStorage.getItem('profileGender') || 'Мужской');
      setProfileDescription(localStorage.getItem('profileDescription') || '');
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('profile-updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profile-updated', handleStorageChange);
    };
  }, []);

  const availableChars = useMemo(() => {
    if (userGender === 'Мужской') return CHARACTERS.filter(c => c.type === 'waifu');
    if (userGender === 'Женский') return CHARACTERS.filter(c => c.type === 'husbando');
    return CHARACTERS;
  }, [userGender]);

  const favChar = CHARACTERS.find(c => c.id === selectedFavCharId) || CHARACTERS[0];

  const [isQuestsModalOpen, setIsQuestsModalOpen] = useState(false);
  const [isQuotesModalOpen, setIsQuotesModalOpen] = useState(false);
  const [isFavCharModalOpen, setIsFavCharModalOpen] = useState(false);
  const [activeMangaTab, setActiveMangaTab] = useState('Читаю');

  const stats = [
    { label: 'Главы прочитал(а)', value: '0', icon: 'book' },
    { label: 'Тайтлов оценил(а)', value: '0', icon: 'star' }
  ];

  const ACHIEVEMENTS = [
    { id: 1, name: 'Первая кровь', icon: '/achievements/achiev_1_first_blood_1783959240829.jpg' },
    { id: 2, name: 'Коллекционер', icon: '/achievements/achiev_2_collector_1783959248703.jpg' },
    { id: 3, name: 'Ветеран', icon: '/achievements/achiev_3_veteran_1783959255951.jpg' },
    { id: 4, name: 'Общительный', icon: '/achievements/achiev_4_social_1783959265886.jpg' }
  ];

  const history = [
    { id: 1, type: 'security', title: 'Новое достижение', desc: 'Первая кровь: Вы прочитали первую главу!', time: '15 минут назад', image: '/achievements/achiev_1_first_blood_1783959240829.jpg' },
    { id: 2, type: 'bookmark', title: 'Обновление закладок : В планах', desc: 'Непобедимый гурман другого мира', time: '15 часов назад', image: '/manga_collage_v17.jpg' },
  ];

  const mangas = [];

  const mangaTabs = ['Читаю', 'В планах', 'Прочитано', 'Перечитываю', 'Отложено', 'Брошено'];

  // Github style streak (7 days x 14 weeks)
  const streakRows = 7;
  const streakCols = 14;
  const streakData = useMemo(() => {
    return Array.from({ length: streakCols }).map(() => 
      Array.from({ length: streakRows }).map(() => Math.random() > 0.4 ? Math.floor(Math.random() * 4) + 1 : 0)
    );
  }, []);

  return (
    <>
      {selectedWallpaper !== 'none' && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: -1,
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.85)), url(${selectedWallpaper})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
      )}
      <div className={styles.profileContainer}>
      {/* Banner & Header */}
      <div className={styles.bannerWrapper}>
        <div className={styles.banner} style={{ backgroundImage: `url(${selectedBanner})` }}></div>
        <div className={styles.profileHeader}>
          <div className={styles.phAvatar}>
            <img src={selectedAvatar} alt="Avatar" className={styles.avatarImg} />
            {selectedFrame && selectedFrame !== 'none' && (
              <>
                <img 
                  src={selectedFrame.split('?')[0] === '/frames/frame_4.png' ? '/frames/frame_4_base.png?v=5' : selectedFrame.split('?')[0] + '?v=13'} 
                  alt="Frame Base" 
                  className={`${styles.frameImg} ${selectedFrame.includes('frame_3') ? styles.animFan : ''}`} 
                />
                {selectedFrame.includes('frame_4') && (
                  <img 
                    src="/frames/frame_4_ear.png?v=5" 
                    alt="Frame Ear" 
                    className={`${styles.frameImg} ${styles.animHat}`} 
                  />
                )}
              </>
            )}
          </div>
          <div className={styles.phInfo}>
            <h1 className={styles.username}>{session?.username || 'Tor1cks'}</h1>
            <div className={styles.phMeta}>
              <div className={styles.levelBadge}>
                <span className={styles.lvlNum}>1</span> Уровень
              </div>
              {profileDescription && (
                <div className={styles.phDescription}>
                  {profileDescription}
                </div>
              )}
            </div>
          </div>
          {/* Edit button now navigates to settings appearance tab */}
          <button className={styles.editBtn} onClick={() => navigate('/settings?tab=appearance')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
            Изменить профиль
          </button>
        </div>
      </div>

      <div className={styles.layoutGrid}>
        
        {/* Left Column (Main Content) */}
        <div className={styles.mainCol}>
          
          {/* Manga Library */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <div className={styles.sectionHeader}>
              <h2>Библиотека манги</h2>
              <button className={styles.btnAllManga} onClick={() => navigate('/library')}>Вся манга &gt;</button>
            </div>
            <div className={styles.libraryTabs} onClick={() => navigate('/library')} style={{ cursor: 'pointer' }}>
              <span className={activeMangaTab === 'Читаю' ? styles.libTabActive : ''}>Читаю</span>
              <span className={activeMangaTab === 'В планах' ? styles.libTabActive : ''}>В планах</span>
              <span className={activeMangaTab === 'Прочитано' ? styles.libTabActive : ''}>Прочитано</span>
              <span className={activeMangaTab === 'Перечитываю' ? styles.libTabActive : ''}>Перечитываю</span>
              <span className={activeMangaTab === 'Отложено' ? styles.libTabActive : ''}>Отложено</span>
              <span className={activeMangaTab === 'Брошено' ? styles.libTabActive : ''}>Брошено</span>
            </div>
            <div className={styles.mangaGrid}>
              {mangas.length > 0 ? (
                mangas.map(m => (
                  <div key={m.id} className={styles.mCard}>
                    <img src={m.image} alt={m.title} />
                    <div className={styles.mStatus}>{m.status}</div>
                    <div className={styles.mTitleOverlay}>{m.title}</div>
                  </div>
                ))
              ) : (
                <div className={styles.emptyState}>
                  <SvgIcon name="book" />
                  <p>Пока тут пусто</p>
                </div>
              )}
            </div>
          </section>

          {/* Quests */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <div className={styles.sectionHeader}>
              <h2>Ежедневные задания</h2>
              <button className={styles.btnOpenQuests} onClick={() => setIsQuestsModalOpen(true)}>Открыть все задания &gt;</button>
            </div>
            <div className={styles.questsGrid}>
              {ALL_QUESTS.slice(0, 3).map((q, i) => (
                <div key={q.id} className={styles.questCard}>
                  <div className={styles.questTop}>
                    <h4>{q.text}</h4>
                    {i === 0 && <span className={styles.newBadge}>NEW</span>}
                  </div>
                  <div className={styles.rewards}>
                    <div className={styles.reward}><SvgIcon name="star" /> 33</div>
                    <div className={styles.reward}><SvgIcon name="user" /> 23</div>
                  </div>
                  <div className={styles.progressBarWrapper}>
                    <div className={styles.progressBar}>
                      <div className={styles.progressFill} style={{width: `${q.progress}%`}}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <div className={styles.sectionHeader}>
              <h2>Достижения <span className={styles.count}>4</span></h2>
              <a href="#" className={styles.linkAll}>Все достижения &gt;</a>
            </div>
            <div className={styles.achievementsRow}>
              {ACHIEVEMENTS.map(ach => (
                <div key={ach.id} className={styles.achievItem} title={ach.name}>
                  <img src={ach.icon} alt={ach.name} className={styles.achievImg} />
                </div>
              ))}
            </div>
          </section>

          {/* Favorite Quotes - Filling empty space */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <div className={styles.sectionHeader}>
              <h2>Избранные цитаты <span className={styles.count}>12</span></h2>
              <button className={styles.linkAll} onClick={() => setIsQuotesModalOpen(true)} style={{background: 'transparent', border: 'none', cursor: 'pointer'}}>Все цитаты &gt;</button>
            </div>
            <div className={styles.quotesGrid}>
              <div className={styles.quoteCard}>
                <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                <p>«Люди, у которых нет ничего, кроме своей силы, в конечном итоге погибают.»</p>
                <span>— Макима (Chainsaw Man)</span>
              </div>
              <div className={styles.quoteCard}>
                <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                <p>«Если ты не будешь сражаться, ты не сможешь победить.»</p>
                <span>— Эрен Йегер (Attack on Titan)</span>
              </div>
              <div className={styles.quoteCard}>
                <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                <p>«Страх — это не зло. Он помогает узнать свои слабости.»</p>
                <span>— Гилдартс (Fairy Tail)</span>
              </div>
              <div className={styles.quoteCard}>
                <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                <p>«Мир не совершенен. Поэтому он так прекрасен.»</p>
                <span>— Рой Мустанг (FMA)</span>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column (Sidebar) */}
        <div className={styles.sideCol}>
          
          {/* Feature 1: Ranks and Titles (replaces Karma) */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <h2>Ранги и Титулы</h2>
            <div className={styles.rankCard}>
              <div className={styles.rankIcon}><SvgIcon name="crown" /></div>
              <div className={styles.rankInfo}>
                <h3>Истинный Читатель</h3>
                <p>Редкий титул</p>
              </div>
            </div>
            <p className={styles.rankDesc}>Вы входите в топ 5% самых активных пользователей этой недели.</p>
          </section>

          {/* Feature 2: Favorite Character */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <div className={styles.sectionHeader} style={{ marginBottom: '16px' }}>
              <h2 style={{ margin: 0 }}>Любимый персонаж</h2>
              <button className={styles.btnOpenQuests} onClick={() => setIsFavCharModalOpen(true)}>Выбрать</button>
            </div>
            <div className={styles.favCharCard} onClick={() => setIsFavCharModalOpen(true)}>
              <div className={styles.favCharImg}>
                <img src={favChar.img} alt={favChar.name} />
              </div>
              <div className={styles.favCharInfo}>
                <h4>{favChar.name}</h4>
                <span>{favChar.subtitle}</span>
              </div>
              <div className={styles.favCharHeart}><SvgIcon name="heart" /></div>
            </div>
          </section>

          {/* Feature 3: Reading Streak (7xN grid) */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <h2>Стрик чтения</h2>
            <div className={styles.streakGridWrapper}>
              <div className={styles.streakContainer}>
                <div className={styles.streakMonths}>
                  <span>апр.</span>
                  <span>май</span>
                  <span>июнь</span>
                  <span>июль</span>
                </div>
                <div className={styles.streakMain}>
                  <div className={styles.streakDays}>
                    <span>пн</span>
                    <span>вт</span>
                    <span>ср</span>
                    <span>чт</span>
                    <span>пт</span>
                    <span>сб</span>
                    <span>вс</span>
                  </div>
                  <div className={styles.streakGrid7xN}>
                    {streakData.map((col, colIdx) => (
                      <div key={colIdx} className={styles.streakCol}>
                        {col.map((val, rowIdx) => (
                          <div key={rowIdx} className={`${styles.streakDay} ${val > 0 ? styles[`streakLvl${val}`] : ''}`}></div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className={styles.streakDesc}>Рекордный стрик: <strong>14 дней</strong></div>
          </section>

          {/* Stats (0 0) */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <h2>Статистика</h2>
            <div className={styles.statsList}>
              {stats.map((s, i) => (
                <div key={i} className={styles.statItem}>
                  <div className={`${styles.statIcon} ${s.icon === 'star' ? styles.iconStar : ''}`}>
                    <SvgIcon name={s.icon} />
                  </div>
                  <div className={styles.statInfo}>
                    <h4>{s.value}</h4>
                    <p>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* History */}
          <section className={`${styles.section} ${styles.mainBlock}`}>
            <div className={styles.sectionHeader}>
              <h2>История действий</h2>
            </div>
            <div className={styles.historyList}>
              {history.map(h => (
                <div key={h.id} className={styles.historyItem}>
                  <img src={h.image} className={styles.hAvatar} alt="h" />
                  <div className={styles.hInfo}>
                    <h4>{h.title}</h4>
                    <p>{h.desc}</p>
                    <span>{h.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>

      {/* Quests Modal */}
      {isQuestsModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Все доступные задания</h2>
              <button className={styles.closeBtn} onClick={() => setIsQuestsModalOpen(false)}>
                <SvgIcon name="close" />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.allQuestsGrid}>
                {ALL_QUESTS.map((q) => (
                  <div key={q.id} className={styles.questCard}>
                    <div className={styles.questTop}>
                      <h4>{q.text}</h4>
                    </div>
                    <div className={styles.rewards}>
                      <div className={styles.reward}><SvgIcon name="star" /> 33</div>
                      <div className={styles.reward}><SvgIcon name="user" /> 23</div>
                    </div>
                    <div className={styles.progressBarWrapper}>
                      <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{width: `${q.progress}%`}}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quotes Modal */}
      {isQuotesModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2>Все цитаты (12)</h2>
              <button className={styles.closeBtn} onClick={() => setIsQuotesModalOpen(false)}>
                <SvgIcon name="close" />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div className={styles.allQuestsGrid}>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                  <p>«Я не проиграю. Даже если умру, я выиграю.»</p>
                  <span>— Годжо Сатору (Jujutsu Kaisen)</span>
                </div>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                  <p>«Тот, кто не может пожертвовать чем-то важным, не способен ничего изменить.»</p>
                  <span>— Армин Арлерт (Attack on Titan)</span>
                </div>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                  <p>«Мечты людей никогда не умирают!»</p>
                  <span>— Маршалл Д. Тич (One Piece)</span>
                </div>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                  <p>«Страх — это не зло. Он говорит тебе о твоих слабостях.»</p>
                  <span>— Гилдартс Клайв (Fairy Tail)</span>
                </div>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                  <p>«Если ты не можешь победить в игре — значит ты просто неудачник.»</p>
                  <span>— Ягами Лайт (Death Note)</span>
                </div>
                <div className={styles.quoteCard}>
                  <div className={styles.quoteIcon}><SvgIcon name="quote" /></div>
                  <p>«Единственный способ действительно убежать от страха — это растоптать его.»</p>
                  <span>— Киллуа Золдик (Hunter x Hunter)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fav Char Modal */}
      {isFavCharModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal} style={{ maxWidth: '400px' }}>
            <div className={styles.modalHeader}>
              <h2>Выбор персонажа</h2>
              <button className={styles.closeBtn} onClick={() => setIsFavCharModalOpen(false)}>
                <SvgIcon name="close" />
              </button>
            </div>
            <div className={styles.modalContent}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '8px' }}>
                {availableChars.map(char => (
                  <div 
                    key={char.id}
                    onClick={() => {
                      setSelectedFavCharId(char.id);
                      localStorage.setItem('profileFavChar', char.id);
                      setIsFavCharModalOpen(false);
                    }}
                    style={{ 
                      cursor: 'pointer', 
                      background: 'var(--bg-secondary)', 
                      borderRadius: '16px', 
                      padding: '16px', 
                      border: selectedFavCharId === char.id ? '2px solid var(--accent)' : '2px solid transparent', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      gap: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                      transition: 'transform 0.2s, border-color 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    <img src={char.img} alt={char.name} style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '15px' }}>{char.name}</div>
                      <div style={{ fontSize: '13px', color: 'var(--accent)', marginTop: '4px' }}>{char.subtitle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

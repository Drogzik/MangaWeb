import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { mangaDetails } from '../data/mockData';
import Tabs from '../components/ui/Tabs';

export default function MangaPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const manga = mangaDetails; // In a real app, fetch by id
  
  const [activeTab, setActiveTab] = useState(0);
  const [bookmarkStatus, setBookmarkStatus] = useState(null);
  const [showBookmarkMenu, setShowBookmarkMenu] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [readUpTo, setReadUpTo] = useState(0);

  const getRatingInfo = (rating) => {
    switch(rating) {
      case 1: return { 
        text: 'Катастрофа', color: '#ef4444',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="12" r="1"/><circle cx="15" cy="12" r="1"/><path d="M8 20v2h8v-2"/><path d="m12.5 17-.5-1-.5 1h1z"/><path d="M16 20a2 2 0 0 0 1.56-3.25 8 8 0 1 0-11.12 0A2 2 0 0 0 8 20"/></svg>
      };
      case 2: return { 
        text: 'Ужасно', color: '#f87171',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
      };
      case 3: return { 
        text: 'Очень плохо', color: '#fb923c',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2"/><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a3.13 3.13 0 0 1-3-3.88Z"/></svg>
      };
      case 4: return { 
        text: 'Плохо', color: '#fbbf24',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>
      };
      case 5: return { 
        text: 'Средне', color: '#facc15',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
      };
      case 6: return { 
        text: 'Нормально', color: '#a3e635',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12"/><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z"/></svg>
      };
      case 7: return { 
        text: 'Хорошо', color: '#4ade80',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>
      };
      case 8: return { 
        text: 'Отлично', color: '#2dd4bf',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
      };
      case 9: return { 
        text: 'Великолепно', color: '#60a5fa',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
      };
      case 10: return { 
        text: 'Шедевр', color: '#c084fc',
        icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14"/></svg>
      };
      default: return null;
    }
  };

  const currentRating = hoverRating || userRating;
  const ratingInfo = currentRating ? getRatingInfo(currentRating) : null;

  return (
    <main className="page page--active manga-page">
      {/* Rating Modal */}
      {showRatingModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
        }} onClick={() => setShowRatingModal(false)}>
          <div style={{
            background: 'var(--bg-tertiary)', padding: '40px', borderRadius: '16px',
            border: '1px solid var(--border-light)', textAlign: 'center', minWidth: '360px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.6)'
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 32px 0', fontSize: '24px', fontWeight: '600', color: 'var(--text-primary)' }}>Оцените тайтл</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '32px' }}>
              {[1,2,3,4,5,6,7,8,9,10].map(star => (
                <svg 
                  key={star} width="32" height="32" viewBox="0 0 24 24" 
                  fill={currentRating >= star ? (ratingInfo ? ratingInfo.color : 'var(--accent)') : 'var(--bg-hover)'} 
                  stroke={currentRating >= star ? (ratingInfo ? ratingInfo.color : 'var(--accent)') : 'var(--border-light)'} 
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                  style={{ 
                    cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    transform: hoverRating === star ? 'scale(1.15)' : 'scale(1)'
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => { setUserRating(star); setTimeout(() => setShowRatingModal(false), 400); }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: '64px', justifyContent: 'center' }}>
              <div style={{ fontSize: '32px', fontWeight: '700', color: ratingInfo ? ratingInfo.color : 'var(--text-primary)' }}>
                {currentRating ? `${currentRating} / 10` : ' '}
              </div>
              <div style={{ fontSize: '16px', fontWeight: '500', color: ratingInfo ? ratingInfo.color : 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {ratingInfo ? <>{ratingInfo.icon} {ratingInfo.text}</> : ' '}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Background Hero */}
      <div className="manga-hero">
        <div 
          className="manga-hero__bg" 
          style={{ backgroundImage: `url(${manga.bgUrl})` }} 
        />
        <div className="manga-hero__overlay" />
      </div>

      <div className="container">
        <div className="manga-content">
          {/* Left Sidebar (Cover & Actions) */}
          <aside className="manga-sidebar">
            <div 
              className="manga-sidebar__cover" 
              style={{ backgroundImage: `url(${manga.imageUrl})` }}
            />
            <div className="manga-actions">
              <button className="btn btn--primary manga-actions__read" onClick={() => navigate(`/read/${id || 1}`)}>
                Читать 1 главу
              </button>
              <div style={{ position: 'relative', width: '100%' }}>
                <button 
                  className={`btn ${bookmarkStatus ? 'btn--primary' : 'btn--secondary'} manga-actions__bookmark`}
                  style={{ width: '100%' }}
                  onClick={() => setShowBookmarkMenu(!showBookmarkMenu)}
                >
                  {bookmarkStatus || 'В закладки'}
                </button>
                {showBookmarkMenu && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0, marginTop: '8px',
                    background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-md)', padding: '6px', zIndex: 10,
                    display: 'flex', flexDirection: 'column', gap: '2px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}>
                    {[
                      { name: 'Читаю', icon: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></> },
                      { name: 'В планах', icon: <><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></> },
                      { name: 'Прочитано', icon: <path d="M20 6L9 17l-5-5"/> },
                      { name: 'Любимое', icon: <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/> },
                      { name: 'Брошено', icon: <><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></> }
                    ].map(status => (
                      <div 
                        key={status.name}
                        onClick={() => { setBookmarkStatus(status.name); setShowBookmarkMenu(false); }}
                        style={{
                          padding: '10px 14px', borderRadius: '6px', cursor: 'pointer',
                          background: bookmarkStatus === status.name ? 'var(--bg-hover)' : 'transparent',
                          color: bookmarkStatus === status.name ? 'var(--text-primary)' : 'var(--text-secondary)',
                          display: 'flex', alignItems: 'center', gap: '12px',
                          fontSize: '14px', fontWeight: bookmarkStatus === status.name ? '500' : '400',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = bookmarkStatus === status.name ? 'var(--bg-hover)' : 'transparent'; e.currentTarget.style.color = bookmarkStatus === status.name ? 'var(--text-primary)' : 'var(--text-secondary)'; }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: bookmarkStatus === status.name ? 1 : 0.7 }}>
                          {status.icon}
                        </svg>
                        {status.name}
                      </div>
                    ))}
                    {bookmarkStatus && (
                      <div 
                        onClick={() => { setBookmarkStatus(null); setShowBookmarkMenu(false); }}
                        style={{ 
                          padding: '10px 14px', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', 
                          marginTop: '4px', borderTop: '1px solid var(--border)',
                          display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Удалить из закладок
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Right Main Info */}
          <div className="manga-main">
            <div className="manga-header">
              <div className="manga-header__titles">
                <h1 className="manga-title">{manga.title}</h1>
                <h2 className="manga-original-title">
                  {manga.year} {manga.type} · {manga.originalTitle}
                </h2>
              </div>
              <div className="manga-header__rating">
                <span className="manga-rating-val">{userRating ? (Math.round((parseFloat(manga.rating) * manga.votes + userRating) / (manga.votes + 1) * 100) / 100).toFixed(2) : manga.rating}</span>
                <span className="manga-rating-count">{manga.votes + (userRating ? 1 : 0)} оценок</span>
                <button className="btn-rate" onClick={() => setShowRatingModal(true)}>
                  {userRating ? 'Изменить оценку' : 'Оценить'}
                </button>
              </div>
            </div>

            <div className="manga-tags">
              <span className="manga-tag manga-tag--age">{manga.ageRating}</span>
              {manga.tags.map(tag => (
                <span key={tag} className="manga-tag">{tag}</span>
              ))}
            </div>

            <div className="manga-description">
              {manga.description.split('\n\n').map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <div className="manga-stats">
              <div className="manga-stat">
                <span className="manga-stat__label">Статус тайтла</span>
                <strong className="manga-stat__val">{manga.status}</strong>
              </div>
              <div className="manga-stat">
                <span className="manga-stat__label">Главы</span>
                <strong className="manga-stat__val">{manga.chaptersCount}</strong>
              </div>
              <div className="manga-stat">
                <span className="manga-stat__label">Формат</span>
                <strong className="manga-stat__val">{manga.format}</strong>
              </div>
              <div className="manga-stat">
                <span className="manga-stat__label">Просмотры</span>
                <strong className="manga-stat__val">{manga.views}</strong>
              </div>
            </div>

            <div className="manga-tabs-section" style={{ marginTop: '32px' }}>
              <Tabs items={['Главы', 'Комментарии', 'Похожее', 'О тайтле']} activeTab={activeTab} onTabChange={setActiveTab} />
              
              <div className="manga-tabs-content">
                {activeTab === 3 && (
                  <div className="manga-about" style={{ padding: '24px 0' }}>
                    
                    {/* Characters */}
                    <div className="manga-section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Главные герои</h3>
                        <span style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer' }}>Все герои &gt;</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {[
                          { name: 'Со Джу Хон', img: '/avatar_1_boy_1783958087860.jpg' },
                          { name: 'Айрин', img: '/avatar_2_girl_1783958096727.jpg' },
                        ].map((char, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '120px', flexShrink: 0 }}>
                            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)', overflow: 'hidden' }}>
                              <img src={char.img} alt={char.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.2' }}>{char.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Staff */}
                    <div className="manga-section" style={{ marginTop: '32px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--text-primary)', margin: 0 }}>Персонал</h3>
                        <span style={{ fontSize: '13px', color: 'var(--accent)', cursor: 'pointer' }}>Все создатели &gt;</span>
                      </div>
                      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                        {[...manga.authors, ...manga.translators].map((staff, i) => (
                          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '120px', flexShrink: 0 }}>
                            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 'var(--radius-md)', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '24px', fontWeight: 'bold' }}>
                              {staff.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: '500', color: 'var(--text-primary)', fontSize: '13px', lineHeight: '1.2' }}>{staff.name}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '2px' }}>{staff.role}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {activeTab === 0 && (
                  <div className="manga-chapters">
                    <div className="chapter-search" style={{ position: 'relative' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                        <circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                      </svg>
                      <input type="text" placeholder="Номер или название главы" style={{ paddingLeft: '44px' }} />
                    </div>
                    <div className="chapter-list">
                      {Array.from({ length: 50 }).map((_, i) => {
                        const chapterNum = manga.chaptersCount - i;
                        const isRead = chapterNum <= readUpTo;
                        
                        return (
                          <div 
                            key={chapterNum} 
                            className="chapter-row"
                            style={{ cursor: 'pointer', opacity: isRead ? 0.6 : 1 }}
                            onClick={() => navigate(`/read/${id || 1}`)}
                          >
                            <div className="chapter-row__info">
                              <div 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setReadUpTo(isRead && readUpTo === chapterNum ? chapterNum - 1 : chapterNum);
                                }}
                                style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                              >
                                {isRead ? (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                                  </svg>
                                ) : (
                                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
                                  </svg>
                                )}
                              </div>
                              <span className="chapter-row__name" style={{ color: isRead ? 'var(--text-secondary)' : 'var(--text-primary)' }}>Глава {chapterNum}</span>
                            </div>
                            <span className="chapter-row__date">
                              {new Date(Date.now() - i * 86400000).toLocaleDateString('ru-RU')}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
                {activeTab === 1 && (
                  <div className="manga-comments" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '16px 0' }}>
                    <div style={{ display: 'flex', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--bg-hover)', flexShrink: 0 }}></div>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <textarea 
                          placeholder="Оставьте ваш комментарий..."
                          style={{
                            width: '100%', background: 'var(--bg-tertiary)', border: '1px solid var(--border)',
                            color: 'var(--text-primary)', padding: '16px', borderRadius: 'var(--radius-md)',
                            minHeight: '100px', resize: 'vertical', fontFamily: 'inherit'
                          }}
                        />
                        <button className="btn btn--primary" style={{ alignSelf: 'flex-end', padding: '10px 24px' }}>Отправить</button>
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px' }}>
                      {[1, 2, 3, 4, 5].map((_, i) => (
                        <div key={i} style={{ display: 'flex', gap: '16px' }}>
                          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-hover)', flexShrink: 0 }}></div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                              <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Пользователь {i + 1}</span>
                              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{i + 1} дн. назад</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                              Это просто шедевр! Рисовка отличная, сюжет затягивает с первых глав. Жду продолжения с нетерпением, рекомендую всем к прочтению.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 2 && (
                  <div className="manga-similar" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '20px', padding: '16px 0' }}>
                    {[
                      { title: 'Поднятие уровня в одиночку', img: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Всеведущий читатель', img: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Начало после конца', img: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Ранкер, который живет второй раз', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=300&auto=format&fit=crop' },
                      { title: 'Возвращение хулигана', img: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=300&auto=format&fit=crop' }
                    ].map((m, i) => (
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', cursor: 'pointer' }}>
                        <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: 'var(--radius-md)', background: 'var(--bg-hover)', overflow: 'hidden' }}>
                          <img src={m.img} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                        </div>
                        <div style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.3' }}>{m.title}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

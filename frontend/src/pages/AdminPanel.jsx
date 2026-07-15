import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './AdminPanel.module.css';
import { PREDEFINED_GENRES } from '../data/genres';

export default function AdminPanel() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState('manual'); // 'manual' | 'bot'

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    cover: '',
    rating: 0,
    chapters: 0,
    genres: []
  });

  const [searchGenreInput, setSearchGenreInput] = useState('');
  const [customGenreInput, setCustomGenreInput] = useState('');
  const [isGenrePanelOpen, setIsGenrePanelOpen] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Bot Chat State
  const [botMessages, setBotMessages] = useState([
    { role: 'bot', text: 'Привет! Я бот-помощник. Напиши мне название манги, и я сам найду описание, жанры и главных персонажей, а затем добавлю их в каталог.' }
  ]);
  const [botInput, setBotInput] = useState('');

  // Protect route
  if (!session) {
    return (
      <div className={styles.container}>
        <h2>Доступ запрещен</h2>
        <p>Пожалуйста, войдите в аккаунт.</p>
        <button className={styles.btn} onClick={() => navigate('/')}>На главную</button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddCustomGenre = (e) => {
    if (e) e.preventDefault();
    const trimmed = customGenreInput.trim();
    if (trimmed && !formData.genres.includes(trimmed)) {
      setFormData(prev => ({ ...prev, genres: [...prev.genres, trimmed] }));
      setCustomGenreInput('');
    } else if (!trimmed) {
      setIsGenrePanelOpen(true);
    }
  };

  const handleRemoveGenre = (genreToRemove) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.filter(g => g !== genreToRemove)
    }));
  };

  const handlePredefinedGenreAdd = (genre) => {
    if (!formData.genres.includes(genre)) {
      setFormData(prev => ({ ...prev, genres: [...prev.genres, genre] }));
    }
  };
  
  const handleCustomGenreKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomGenre(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const mangaData = {
        ...formData,
        rating: parseFloat(formData.rating),
        chapters: parseInt(formData.chapters, 10),
        genres: formData.genres
      };

      const response = await fetch('/api/manga', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mangaData)
      });

      if (!response.ok) {
        throw new Error('Ошибка сервера: ' + response.statusText);
      }

      setSuccess(`Манга "${formData.title}" успешно добавлена!`);
      setFormData({
        title: '',
        author: '',
        description: '',
        cover: '',
        rating: 0,
        chapters: 0,
        genres: []
      });
      setCustomGenreInput('');
      setSearchGenreInput('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBotSubmit = (e) => {
    e.preventDefault();
    if (!botInput.trim()) return;

    setBotMessages(prev => [...prev, { role: 'user', text: botInput }]);
    const currentInput = botInput;
    setBotInput('');

    // Simulate bot parsing manga info
    setTimeout(() => {
      setBotMessages(prev => [...prev, { 
        role: 'bot', 
        text: `Манга "${currentInput}" найдена!\n\nОписание: Это эпическая история о захватывающих приключениях и преодолении преград.\nЖанры: Сёнен, Экшен, Приключения\nГлавные персонажи: Протагонист, его верный друг и загадочный наставник.\n\nЗаполняю форму и добавляю в каталог...`
      }]);
    }, 1000);
  };

  return (
    <div className={styles.pageLayout} data-panel-open={isGenrePanelOpen}>
      <div className={styles.container}>
        
        <div className={styles.headerRow}>
          <button className={styles.arrowBtn} onClick={() => setViewMode(viewMode === 'manual' ? 'bot' : 'manual')} title="Предыдущий экран">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div>
            <h1 className={styles.title}>Панель для манги</h1>
            <p className={styles.subtitle}>
              {viewMode === 'manual' ? 'Ручное добавление в каталог' : 'Бот-помощник'}
            </p>
          </div>

          <button className={styles.arrowBtn} onClick={() => setViewMode(viewMode === 'manual' ? 'bot' : 'manual')} title="Следующий экран">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <div className={styles.sliderWrapper}>
          
          {/* Slide 1: Manual Form */}
          <div className={`${styles.slide} ${viewMode === 'manual' ? styles.slideManual : styles.slideManualHidden}`}>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Название *</label>
                <input required name="title" value={formData.title} onChange={handleChange} placeholder="Например: One Piece" />
              </div>
              
              <div className={styles.formGroup}>
                <label>Автор *</label>
                <input required name="author" value={formData.author} onChange={handleChange} placeholder="Например: Эйитиро Ода" />
              </div>

              <div className={styles.formGroup}>
                <label>Описание</label>
                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Коротко о сюжете..." rows="3" />
              </div>

              <div className={styles.row}>
                <div className={styles.formGroup}>
                  <label>Количество глав</label>
                  <div className={styles.numberInputWrapper}>
                    <button type="button" className={styles.numBtn} onClick={() => setFormData(prev => ({...prev, chapters: Math.max(0, parseInt(prev.chapters || 0) - 1)}))}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <input type="number" name="chapters" value={formData.chapters} onChange={handleChange} min="0" className={styles.numberInput} />
                    <button type="button" className={styles.numBtn} onClick={() => setFormData(prev => ({...prev, chapters: parseInt(prev.chapters || 0) + 1}))}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Рейтинг (0-5)</label>
                  <div className={styles.numberInputWrapper}>
                    <button type="button" className={styles.numBtn} onClick={() => setFormData(prev => ({...prev, rating: Math.max(0, (parseFloat(prev.rating || 0) - 0.1).toFixed(1))}))}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                    <input type="number" name="rating" value={formData.rating} onChange={handleChange} min="0" max="5" step="0.1" className={styles.numberInput} />
                    <button type="button" className={styles.numBtn} onClick={() => setFormData(prev => ({...prev, rating: Math.min(5, (parseFloat(prev.rating || 0) + 0.1).toFixed(1))}))}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className={styles.formGroup}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <label>Выбранные жанры *</label>
                </div>
                <div 
                  className={styles.tagsWrapper} 
                  onClick={(e) => {
                    if (e.target.closest('button')) return;
                    const input = e.currentTarget.querySelector('input[name="customGenreInput"]');
                    if (input) input.focus();
                    setIsGenrePanelOpen(true);
                  }}
                  style={{ cursor: 'text' }}
                >
                  {formData.genres.map(genre => (
                    <span key={genre} className={styles.tag}>
                      {genre}
                      <button type="button" onClick={() => handleRemoveGenre(genre)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </span>
                  ))}
                  <div style={{ flex: 1, minWidth: '150px' }}>
                    <input 
                      type="text"
                      name="customGenreInput" 
                      value={customGenreInput} 
                      onChange={e => setCustomGenreInput(e.target.value)} 
                      onKeyDown={handleCustomGenreKeyDown}
                      placeholder="Вписать свой жанр..."
                      className={styles.tagInput}
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      const trimmed = customGenreInput.trim();
                      if (trimmed && !formData.genres.includes(trimmed)) {
                        setFormData(prev => ({ ...prev, genres: [...prev.genres, trimmed] }));
                        setCustomGenreInput('');
                      } else if (!trimmed) {
                        setIsGenrePanelOpen(!isGenrePanelOpen);
                      }
                    }} 
                    className={styles.tagAddBtn}
                    style={{
                      transform: isGenrePanelOpen && !customGenreInput.trim() ? 'rotate(45deg)' : 'none'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                  </button>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>URL обложки</label>
                <input name="cover" value={formData.cover} onChange={handleChange} placeholder="https://example.com/cover.jpg" />
              </div>

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Добавление...' : 'Добавить мангу'}
              </button>
            </form>
          </div>

          {/* Slide 2: Bot Interface */}
          <div className={`${styles.slide} ${viewMode === 'bot' ? styles.slideBot : styles.slideBotHidden}`}>
            <div className={styles.botChat}>
              <div className={styles.botMessages}>
                {botMessages.map((msg, i) => (
                  <div key={i} className={msg.role === 'bot' ? styles.msgBot : styles.msgUser}>
                    {msg.text}
                  </div>
                ))}
              </div>
              <form className={styles.botInputArea} onSubmit={handleBotSubmit}>
                <input 
                  type="text" 
                  value={botInput} 
                  onChange={e => setBotInput(e.target.value)} 
                  placeholder="Напишите название манги..." 
                  className={styles.botInput}
                />
                <button type="submit" className={styles.botSendBtn}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>

      {/* Right Side Panel for Genres */}
      <div className={`${styles.genrePanelWrapper} ${!isGenrePanelOpen ? styles.genrePanelWrapperHidden : ''}`}>
        <div className={styles.genrePanel}>
          <div className={styles.genrePanelHeader}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
              <h2 className={styles.genrePanelTitle} style={{margin: 0}}>Все жанры</h2>
              <button type="button" className={styles.closePanelBtn} onClick={() => setIsGenrePanelOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className={styles.genreSearchWrapper}>
              <svg className={styles.genreSearchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Поиск жанров..." 
                value={searchGenreInput}
                onChange={(e) => setSearchGenreInput(e.target.value)}
                className={styles.genreSearchInput}
              />
            </div>
          </div>
          <div className={styles.genrePanelGrid}>
            {PREDEFINED_GENRES
              .filter(g => g.toLowerCase().includes(searchGenreInput.toLowerCase()))
              .map(g => {
                const isSelected = formData.genres.includes(g);
                return (
                  <div 
                    key={g} 
                    className={`${styles.genrePanelOption} ${isSelected ? styles.genrePanelOptionSelected : ''}`}
                    onClick={() => {
                      if (isSelected) {
                        handleRemoveGenre(g);
                      } else {
                        handlePredefinedGenreAdd(g);
                      }
                    }}
                  >
                    {g}
                  </div>
                );
            })}
            {PREDEFINED_GENRES.filter(g => g.toLowerCase().includes(searchGenreInput.toLowerCase())).length === 0 && (
              <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)'}}>Ничего не найдено</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { useParams, Link } from 'react-router-dom';
import { mangaDetails } from '../data/mockData';
import Tabs from '../components/ui/Tabs';

export default function MangaPage() {
  const { id } = useParams();
  const manga = mangaDetails; // In a real app, fetch by id

  return (
    <main className="page page--active manga-page">
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
              <button className="btn btn--primary manga-actions__read">
                Читать 1 главу
              </button>
              <button className="btn btn--secondary manga-actions__bookmark">
                В закладки
              </button>
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
                <span className="manga-rating-val">{manga.rating}</span>
                <span className="manga-rating-count">{manga.votes} оценок</span>
                <button className="btn-rate">Оценить</button>
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

            <div className="manga-credits">
              <div className="manga-credit-group">
                <span className="manga-credit-group__title">Авторский состав</span>
                <div className="manga-credit-list">
                  {manga.authors.map(a => (
                    <div key={a.name} className="manga-credit-item">
                      <span className="manga-credit-item__name">{a.name}</span>
                      <span className="manga-credit-item__role">{a.role}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="manga-credit-group">
                <span className="manga-credit-group__title">Перевод</span>
                <div className="manga-credit-list">
                  {manga.translators.map(t => (
                    <div key={t.name} className="manga-credit-item">
                      <span className="manga-credit-item__name">{t.name}</span>
                      <span className="manga-credit-item__role">{t.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs Area */}
            <div className="manga-tabs-section">
              <Tabs items={['Главы', 'Комментарии', 'Персонажи', 'Похожее']} />
              <div className="manga-tabs-content">
                <div className="manga-chapters">
                  <div className="chapter-search">
                    <input type="text" placeholder="Номер или название главы" />
                  </div>
                  <div className="chapter-list">
                    {Array.from({ length: 50 }).map((_, i) => {
                      const chapterNum = manga.chaptersCount - i;
                      return (
                        <div key={chapterNum} className="chapter-row">
                          <div className="chapter-row__info">
                            <span className="chapter-row__name">Глава {chapterNum}</span>
                          </div>
                          <span className="chapter-row__date">
                            {new Date(Date.now() - i * 86400000).toLocaleDateString('ru-RU')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

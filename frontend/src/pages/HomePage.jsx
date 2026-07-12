import { useState } from 'react';
import { Link } from 'react-router-dom';
import Tabs from '../components/ui/Tabs';
import MangaCard from '../components/manga/MangaCard';
import { useContinueFade } from '../hooks/useDragScroll';
import { useDragScroll } from '../hooks/useDragScroll';
import {
  topReadManga,
  continueReading,
  labels,
  latestUpdates,
  activityUsers,
} from '../data/mockData';


const tagClass = { manga: 'tag--manga', manhwa: 'tag--manhwa', manhua: 'tag--manhua' };

export default function HomePage() {
  const { trackRef, sliderRef } = useContinueFade();
  const labelsRef = useDragScroll();
  const mangaRowRef = useDragScroll();
  const [updatesExpanded, setUpdatesExpanded] = useState(false);

  return (
    <main className="page page--active">
      <div className="container container--wide">
        <section className="section">
          <div className="section__header">
            <div className="section__title-row">
              <h2 className="section__title">Самое читаемое</h2>
              <span className="section__badge">TOP</span>
            </div>
            <Tabs items={['За день', 'За неделю', 'За месяц']} />
          </div>
          <div className="manga-row drag-scroll" ref={mangaRowRef}>
            {topReadManga.map(item => (
              <MangaCard key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <div className="section__header-left">
              <h2 className="section__title">Продолжить чтение</h2>
              <p className="section__subtitle">Это главы, которые вы ещё не прочитали. Данный список генерируется на основании ваших закладок.</p>
            </div>
            <a href="#" className="section__more" onClick={e => e.preventDefault()}>Вся история →</a>
          </div>
          <div className="continue-slider" ref={sliderRef}>
            <div className="continue-slider__track drag-scroll" ref={trackRef}>
              {continueReading.map(item => (
                <Link to="/manga/1" key={item.title} className="continue-item">
                  <div className="continue-item__cover-wrap">
                    <div className={`continue-item__cover cover cover--${item.cover}`} />
                    <span className="continue-item__type">{item.type}</span>
                  </div>
                  <div className="continue-item__body">
                    <h3>{item.title}</h3>
                    <p className={`continue-item__chapters${item.isNew ? ' continue-item__chapters--new' : ''}`}>{item.chapters}</p>
                    <time>{item.time}</time>
                    <div className="continue-item__bar"><span style={{ width: `${item.progress}%` }} /></div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section__header section__header--stack">
            <h2 className="section__title">Все лейблы</h2>
            <p className="section__subtitle">От самых популярных, до менее известных</p>
          </div>
          <div className="labels-wrap">
            <div className="labels-row drag-scroll" ref={labelsRef}>
              {labels.map(label => (
                <a key={label.name} href="#" className="label-card" onClick={e => e.preventDefault()}>
                  <div className={`label-card__cover cover cover--${label.cover}`} />
                  <h3>{label.name}</h3>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="section">
          <div className="section__header">
            <h2 className="section__title">Последние обновления</h2>
            <a href="#" className="section__more" onClick={e => e.preventDefault()}>Лента новых глав →</a>
          </div>
          <div className={`updates-list${updatesExpanded ? ' updates-list--expanded' : ''}`}>
            {latestUpdates.map(item => (
              <Link to="/manga/1" key={item.title} className={`update-item${item.extra ? ' update-item--extra' : ''}`}>
                <div className={`update-item__cover cover cover--${item.cover}`} />
                <div className="update-item__body">
                  <span className={`tag ${tagClass[item.type]}`}>{item.type}</span>
                  <h3>{item.title}</h3>
                  <div className="update-item__chapter">
                    {item.chapter} <time>{item.time}</time>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {!updatesExpanded && (
            <button type="button" className="updates-more" onClick={() => setUpdatesExpanded(true)}>Показать ещё</button>
          )}
        </section>

        <section className="section section--secondary">
          <div className="activity-block">
            <div className="activity-block__header">
              <h3>Топ пользователей</h3>
              <a href="#" className="activity-block__link" onClick={e => e.preventDefault()}>Все →</a>
            </div>
            <div className="activity-grid-h">
              {activityUsers.map(user => (
                <a
                  key={user.name}
                  href="#"
                  className={`activity-item${user.variant ? ` activity-item--${user.variant}` : ''}`}
                  onClick={e => e.preventDefault()}
                >
                  <span className="activity-item__rank">{user.rank}</span>
                  <div className="activity-item__avatar">{user.initials}</div>
                  <div className="activity-item__info">
                    <strong>{user.name}</strong>
                    <span>Ур. {user.level}</span>
                  </div>
                  <span className="activity-item__xp">{user.xp}</span>
                </a>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

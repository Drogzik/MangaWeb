import { Link } from 'react-router-dom';

export default function MangaCard({ title, type, cover, rating, status, isNew, variant = 'default' }) {
  const isCatalog = variant === 'catalog';
  const isNewCard = variant === 'new';

  return (
    <Link to="/manga/1" className={`manga-card${isNewCard ? ' manga-card--new' : ''}`}>
      {isNewCard && <span className="manga-card__new-badge">NEW</span>}
      <div className={`manga-card__cover cover cover--${cover}`}>
        {status && <span className="manga-card__status">{status}</span>}
        {isCatalog ? (
          <div className="manga-card__bar">
            <span className="manga-card__type">{type}</span>
            <span className="manga-card__rating">+ {rating}</span>
          </div>
        ) : isNewCard ? (
          <span className="manga-card__rating">{rating}</span>
        ) : (
          <div className="manga-card__bar">
            <span className="manga-card__type">{type}</span>
            <span className="manga-card__rating">+ {rating}</span>
          </div>
        )}
      </div>
      {isNewCard && <p className="manga-card__type">{type}</p>}
      <h3 className="manga-card__title">{title}</h3>
    </Link>
  );
}

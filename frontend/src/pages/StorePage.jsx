import { useState, useRef, useEffect } from 'react';
import styles from './StorePage.module.css';

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.starIcon}>
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.eyeIcon}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const FilterIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const InfoIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" />
  </svg>
);

const RefreshIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

// Expanded mock data with categories and filter attributes
const mockItems = [
  { id: 1, title: 'Char 127691', category: 'Аватары', price: 4500, image: '/avatars/char_127691.jpg', ageRating: '0+', isSubOnly: true, subPrice: 3600, limitedCount: 100 },
  { id: 2, title: 'Char 14', category: 'Аватары', price: 500, image: '/avatars/char_14.jpg', ageRating: '12+' },
  { id: 3, title: 'Char 27', category: 'Аватары', price: 500, image: '/avatars/char_27.jpg', ageRating: '16+', isSubOnly: true, subPrice: 400 },
  { id: 4, title: 'Char 34470', category: 'Аватары', price: 4500, image: '/avatars/char_34470.jpg', ageRating: '16+' },
  { id: 5, title: 'Char 40', category: 'Аватары', price: 10000, image: '/avatars/char_40.jpg', ageRating: '12+' },
  { id: 6, title: 'Char 40881', category: 'Аватары', price: 1500, image: '/avatars/char_40881.jpg', ageRating: '0+', isSubOnly: true, subPrice: 1200, limitedCount: 10 },
  { id: 7, title: 'Char 40882', category: 'Аватары', price: 500, image: '/avatars/char_40882.jpg', ageRating: '0+', limitedCount: 100 },
  { id: 8, title: 'Char 417', category: 'Аватары', price: 2000, image: '/avatars/char_417.jpg', ageRating: '16+' },
  { id: 9, title: 'Char 422', category: 'Аватары', price: 10000, image: '/avatars/char_422.jpg', ageRating: '0+', limitedCount: 100 },
  { id: 10, title: 'Char 45627', category: 'Аватары', price: 500, image: '/avatars/char_45627.jpg', ageRating: '0+', isSubOnly: true, subPrice: 400, limitedCount: 500 },
  { id: 11, title: 'Char 62', category: 'Аватары', price: 1000, image: '/avatars/char_62.jpg', ageRating: '0+' },
  { id: 12, title: 'Char 71', category: 'Аватары', price: 1500, image: '/avatars/char_71.jpg', ageRating: '18+', limitedCount: 100 },
  { id: 13, title: 'Char 87275', category: 'Аватары', price: 500, image: '/avatars/char_87275.jpg', ageRating: '0+', discount: '-10%', oldPrice: 1000, limitedCount: 10 },
  { id: 14, title: 'Char 88572', category: 'Аватары', price: 2000, image: '/avatars/char_88572.jpg', ageRating: '0+', limitedCount: 100 },
  { id: 15, title: 'Char 89334', category: 'Аватары', price: 1500, image: '/avatars/char_89334.jpg', ageRating: '0+', limitedCount: 500 },
  { id: 16, title: 'Debug Oni', category: 'Рамки аватара', price: 1500, image: '/frames/debug_oni.png', ageRating: '16+', discount: '-10%', oldPrice: 2000, limitedCount: 100 },
  { id: 17, title: 'Frame 3', category: 'Рамки аватара', price: 1500, image: '/frames/frame_3.png', ageRating: '18+', limitedCount: 10 },
  { id: 18, title: 'Frame 3 Folded', category: 'Рамки аватара', price: 1000, image: '/frames/frame_3_folded.png', ageRating: '0+', limitedCount: 100 },
  { id: 19, title: 'Frame 4', category: 'Рамки аватара', price: 3000, image: '/frames/frame_4.png', ageRating: '0+', limitedCount: 50 },
  { id: 20, title: 'Frame 4 Base', category: 'Рамки аватара', price: 2000, image: '/frames/frame_4_base.png', ageRating: '18+', discount: '-10%', oldPrice: 2500, isSubOnly: true, subPrice: 1600 },
  { id: 21, title: 'Frame 4 Clean', category: 'Рамки аватара', price: 10000, image: '/frames/frame_4_clean.png', ageRating: '16+', limitedCount: 10 },
  { id: 22, title: 'Frame 4 Ear', category: 'Рамки аватара', price: 3000, image: '/frames/frame_4_ear.png', ageRating: '18+', limitedCount: 100 },
  { id: 23, title: 'Frame Bg Rw', category: 'Рамки аватара', price: 500, image: '/frames/frame_bg_rw.png', ageRating: '18+' },
  { id: 24, title: 'Frame Coloque Um Nome Wmistic Arena', category: 'Рамки аватара', price: 0, image: '/frames/frame_coloque_um_nome_wmistic_arena.png', ageRating: '18+', limitedCount: 100 },
  { id: 25, title: 'Frame Kitsune', category: 'Рамки аватара', price: 1500, image: '/frames/frame_kitsune.png', ageRating: '0+', limitedCount: 500 },
  { id: 26, title: 'Frame Oni', category: 'Рамки аватара', price: 4500, image: '/frames/frame_oni.png', ageRating: '0+' },
  { id: 27, title: 'Banner 101922', category: 'Баннеры', price: 10000, image: '/banners/banner_101922.jpg', ageRating: '0+', isSubOnly: true, subPrice: 8000, limitedCount: 50 },
  { id: 28, title: 'Banner 11061', category: 'Баннеры', price: 1500, image: '/banners/banner_11061.jpg', ageRating: '0+', discount: '-10%', oldPrice: 2000 },
  { id: 29, title: 'Banner 113415', category: 'Баннеры', price: 500, image: '/banners/banner_113415.jpg', ageRating: '18+', limitedCount: 10 },
  { id: 30, title: 'Banner 1535', category: 'Баннеры', price: 10000, image: '/banners/banner_1535.jpg', ageRating: '0+', isSubOnly: true, subPrice: 8000, limitedCount: 100 },
  { id: 31, title: 'Banner 16498', category: 'Баннеры', price: 2000, image: '/banners/banner_16498.jpg', ageRating: '16+', discount: '-10%', oldPrice: 2500, limitedCount: 10 },
  { id: 32, title: 'Banner 20605', category: 'Баннеры', price: 1000, image: '/banners/banner_20605.jpg', ageRating: '18+' },
  { id: 33, title: 'Banner 20958', category: 'Баннеры', price: 2000, image: '/banners/banner_20958.jpg', ageRating: '16+', limitedCount: 10 },
  { id: 34, title: 'Banner 21', category: 'Баннеры', price: 0, image: '/banners/banner_21.jpg', ageRating: '16+' },
  { id: 35, title: 'Banner 21087', category: 'Баннеры', price: 3000, image: '/banners/banner_21087.jpg', ageRating: '0+', discount: '-10%', oldPrice: 3500 },
  { id: 36, title: 'Banner 21459', category: 'Баннеры', price: 500, image: '/banners/banner_21459.jpg', ageRating: '18+', discount: '-10%', oldPrice: 1000, limitedCount: 10 },
  { id: 37, title: 'Wall 21Ok29', category: 'Обои', price: 1000, image: '/wallpapers/wall_21ok29.jpg', ageRating: '16+', limitedCount: 10 },
  { id: 38, title: 'Wall 21Oymx', category: 'Обои', price: 1000, image: '/wallpapers/wall_21oymx.jpg', ageRating: '0+', limitedCount: 100 },
  { id: 39, title: 'Wall 21Ozq6', category: 'Обои', price: 2000, image: '/wallpapers/wall_21ozq6.jpg', ageRating: '0+', limitedCount: 100 },
  { id: 40, title: 'Wall 3Q6Kgy', category: 'Обои', price: 4500, image: '/wallpapers/wall_3q6kgy.jpg', ageRating: '0+', discount: '-10%', oldPrice: 5000, limitedCount: 500 },
  { id: 41, title: 'Wall 5Ymdk5', category: 'Обои', price: 10000, image: '/wallpapers/wall_5ymdk5.jpg', ageRating: '0+', discount: '-10%', oldPrice: 10500, isSubOnly: true, subPrice: 8000, limitedCount: 10 },
  { id: 42, title: 'Wall 8G9Kxk', category: 'Обои', price: 1000, image: '/wallpapers/wall_8g9kxk.jpg', ageRating: '12+', limitedCount: 500 },
  { id: 43, title: 'Wall D8O6Rm', category: 'Обои', price: 10000, image: '/wallpapers/wall_d8o6rm.jpg', ageRating: '16+', discount: '-10%', oldPrice: 10500, limitedCount: 500 },
  { id: 44, title: 'Wall D8Oe73', category: 'Обои', price: 500, image: '/wallpapers/wall_d8oe73.jpg', ageRating: '0+', limitedCount: 10 },
  { id: 45, title: 'Wall E86Z6K', category: 'Обои', price: 2000, image: '/wallpapers/wall_e86z6k.jpg', ageRating: '0+', limitedCount: 10 },
  { id: 46, title: 'Wall Jey5Rp', category: 'Обои', price: 500, image: '/wallpapers/wall_jey5rp.jpg', ageRating: '12+' },
  { id: 47, title: 'Wall Jey9Kq', category: 'Обои', price: 2000, image: '/wallpapers/wall_jey9kq.jpg', ageRating: '18+', limitedCount: 100 },
  { id: 48, title: 'Wall Lyjm2R', category: 'Обои', price: 2000, image: '/wallpapers/wall_lyjm2r.jpg', ageRating: '16+', isSubOnly: true, subPrice: 1600, limitedCount: 100 },
  { id: 49, title: 'Wall Lyjqw2', category: 'Обои', price: 3000, image: '/wallpapers/wall_lyjqw2.jpg', ageRating: '12+', isSubOnly: true, subPrice: 2400, limitedCount: 50 },
  { id: 50, title: 'Wall Og62W7', category: 'Обои', price: 10000, image: '/wallpapers/wall_og62w7.jpg', ageRating: '0+', discount: '-10%', oldPrice: 10500 },
  { id: 51, title: 'Wall Po723M', category: 'Обои', price: 3000, image: '/wallpapers/wall_po723m.jpg', ageRating: '16+', isSubOnly: true, subPrice: 2400 },
  { id: 52, title: 'Wall Po727E', category: 'Обои', price: 3000, image: '/wallpapers/wall_po727e.jpg', ageRating: '16+', limitedCount: 50 },
  { id: 53, title: 'Wall Po7M99', category: 'Обои', price: 3000, image: '/wallpapers/wall_po7m99.jpg', ageRating: '0+' },
  { id: 54, title: 'Wall Qrm3Dl', category: 'Обои', price: 1500, image: '/wallpapers/wall_qrm3dl.jpg', ageRating: '0+', limitedCount: 500 },
  { id: 55, title: 'Wall Qrmro7', category: 'Обои', price: 500, image: '/wallpapers/wall_qrmro7.jpg', ageRating: '0+', isSubOnly: true, subPrice: 400 },
  { id: 56, title: 'Wall Rqjvl1', category: 'Обои', price: 3000, image: '/wallpapers/wall_rqjvl1.jpg', ageRating: '0+' },
  { id: 57, title: 'Wall Rqp3Zj', category: 'Обои', price: 1500, image: '/wallpapers/wall_rqp3zj.jpg', ageRating: '0+', limitedCount: 50 },
  { id: 58, title: 'Wall Vpdo98', category: 'Обои', price: 10000, image: '/wallpapers/wall_vpdo98.jpg', ageRating: '0+', discount: '-10%', oldPrice: 10500, limitedCount: 100 },
  { id: 59, title: 'Wall W5D11P', category: 'Обои', price: 500, image: '/wallpapers/wall_w5d11p.jpg', ageRating: '0+', discount: '-10%', oldPrice: 1000, limitedCount: 100 },
  { id: 60, title: 'Wall Yq2Mll', category: 'Обои', price: 3000, image: '/wallpapers/wall_yq2mll.jpg', ageRating: '0+', isSubOnly: true, subPrice: 2400 }
];

export default function StorePage() {
  const [activeTab, setActiveTab] = useState('Аватары');
  const tabs = ['Аватары', 'Рамки аватара', 'Баннеры', 'Обои'];

  // Filter State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef(null);
  
  const [discountFilter, setDiscountFilter] = useState('all'); // 'all', 'discount', 'free'
  const [ageFilter, setAgeFilter] = useState('all'); // 'all', '0+', '12+', '16+', '18+'
  const [limitedFilter, setLimitedFilter] = useState(false);
  const [subOnlyFilter, setSubOnlyFilter] = useState(false);
  const [excludeBought, setExcludeBought] = useState(false);

  // Close filter dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const resetFilters = () => {
    setDiscountFilter('all');
    setAgeFilter('all');
    setLimitedFilter(false);
    setSubOnlyFilter(false);
    setExcludeBought(false);
  };

  // Apply filters
  const filteredItems = mockItems.filter(item => {
    // 1. Tab Match
    if (item.category !== activeTab) return false;

    // 2. Discount Match
    if (discountFilter === 'discount' && !item.discount) return false;
    if (discountFilter === 'free' && item.price > 0 && !item.isFree) return false;

    // 3. Age Match
    if (ageFilter !== 'all' && item.ageRating !== ageFilter) return false;

    // 4. Other Toggles
    if (limitedFilter && !item.limitedCount) return false;
    if (subOnlyFilter && !item.isSubOnly) return false;

    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.title}>Магазин украшений</h1>
          
          <div className={styles.balanceBlock}>
            <a href="#" className={styles.earnLink} onClick={(e) => e.preventDefault()}>
              Как зарабатывать <InfoIcon />
            </a>
            <div className={styles.balance}>
              Баланс: <StarIcon /> 17 203
            </div>
          </div>
        </div>

        <div className={styles.tabs}>
          {tabs.map(tab => (
            <button
              key={tab}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className={styles.filtersBar} ref={filterRef}>
          <button 
            className={`${styles.filterBtn} ${isFilterOpen ? styles.filterBtnActive : ''}`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FilterIcon /> Фильтр
          </button>
          <button className={styles.filterClear} onClick={resetFilters}>
            <span style={{ fontSize: '18px', lineHeight: 1 }}>×</span> Моя рамка
          </button>

          {/* Filter Dropdown */}
          {isFilterOpen && (
            <div className={styles.filterDropdown}>
              <div className={styles.dropdownHeader}>
                <h3 className={styles.dropdownTitle}>Фильтр</h3>
                <div className={styles.dropdownActions}>
                  <button className={styles.dropdownIconBtn} onClick={resetFilters} title="Сбросить фильтры">
                    <RefreshIcon />
                  </button>
                  <button className={styles.dropdownIconBtn} onClick={() => setIsFilterOpen(false)} title="Закрыть">
                    <CloseIcon />
                  </button>
                </div>
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>Со скидкой или бесплатно</div>
                <label className={styles.radioLabel}>
                  <input type="radio" name="discount" className={styles.radioInput} checked={discountFilter === 'all'} onChange={() => setDiscountFilter('all')} />
                  <div className={styles.radioCustom}></div>
                  <span>Все</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="discount" className={styles.radioInput} checked={discountFilter === 'discount'} onChange={() => setDiscountFilter('discount')} />
                  <div className={styles.radioCustom}></div>
                  <span>Только со скидкой</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="discount" className={styles.radioInput} checked={discountFilter === 'free'} onChange={() => setDiscountFilter('free')} />
                  <div className={styles.radioCustom}></div>
                  <span>Бесплатно</span>
                </label>
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>Возрастной рейтинг</div>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === 'all'} onChange={() => setAgeFilter('all')} />
                  <div className={styles.radioCustom}></div>
                  <span>Все возраста</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '0+'} onChange={() => setAgeFilter('0+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Безопасный 0+</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '12+'} onChange={() => setAgeFilter('12+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Сомнительный 12+</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '16+'} onChange={() => setAgeFilter('16+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Спорный 16+</span>
                </label>
                <label className={styles.radioLabel}>
                  <input type="radio" name="age" className={styles.radioInput} checked={ageFilter === '18+'} onChange={() => setAgeFilter('18+')} />
                  <div className={styles.radioCustom}></div>
                  <span>Откровенный 18+</span>
                </label>
              </div>

              <div className={styles.filterSection}>
                <div className={styles.filterSectionTitle}>Другое</div>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" className={styles.toggleInput} checked={limitedFilter} onChange={(e) => setLimitedFilter(e.target.checked)} />
                  <div className={styles.toggleCustom}></div>
                  <span>Ограниченное количество</span>
                </label>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" className={styles.toggleInput} checked={subOnlyFilter} onChange={(e) => setSubOnlyFilter(e.target.checked)} />
                  <div className={styles.toggleCustom}></div>
                  <span>Только с подпиской</span>
                </label>
                <label className={styles.toggleLabel}>
                  <input type="checkbox" className={styles.toggleInput} checked={excludeBought} onChange={(e) => setExcludeBought(e.target.checked)} />
                  <div className={styles.toggleCustom}></div>
                  <span>Исключать купленное</span>
                </label>
              </div>

            </div>
          )}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredItems.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', gridColumn: '1 / -1', padding: '40px 0', textAlign: 'center' }}>
            Ничего не найдено по вашим фильтрам.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className={styles.card}>
              <div className={styles.imageWrap}>
                {item.discount && <span className={styles.badgeTopLeft}>{item.discount}</span>}
                {item.ageRating === '18+' && <span className={styles.badgeTopLeft} style={{ background: '#3b82f6' }}>18+</span>}
                <img src={item.image} alt={item.title} className={styles.avatar} />
                {item.limitedCount && <span className={styles.badgeBottomCenter}>{item.limitedCount} шт осталось</span>}
              </div>
              
              <h3 className={styles.cardTitle}>{item.title}</h3>
              
              {item.price > 0 || item.oldPrice ? (
                <div className={styles.priceRow}>
                  <StarIcon /> {item.price}
                  {item.oldPrice && (
                    <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '12px', marginLeft: '4px', fontWeight: 'normal' }}>
                      {item.oldPrice}
                    </span>
                  )}
                </div>
              ) : (
                <div className={styles.priceRow}>Бесплатно</div>
              )}

              {/* Show either subscription price or "only with subscription" text */}
              {(item.subPrice || item.isSubOnly) && (
                <div className={`${styles.subPriceRow} ${item.isSubOnly ? styles.disabled : ''}`}>
                  <EyeIcon /> 
                  {item.isSubOnly ? 'Только с подпиской' : `${item.subPrice} с подпиской`}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

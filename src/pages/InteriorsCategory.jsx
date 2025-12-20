import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const InteriorsCategory = () => {
  const [loading] = useState(false);

  const interiorsSubcategories = [
    { 
      id: 'modular-kitchen', 
      name: 'Modular Kitchen', 
      icon: '🍳', 
      image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
      productCount: 36
    },
    { 
      id: 'wardrobes', 
      name: 'Wardrobes & Closets', 
      icon: '🚪', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 48
    },
    { 
      id: 'wall-panels', 
      name: 'Wall Panels', 
      icon: '🧱', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 32
    },
    { 
      id: 'false-ceiling', 
      name: 'False Ceiling', 
      icon: '🏠', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 24
    },
    { 
      id: 'room-dividers', 
      name: 'Room Dividers', 
      icon: '🚪', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'tv-units-wall', 
      name: 'TV Units & Wall Units', 
      icon: '📺', 
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
      productCount: 42
    },
    { 
      id: 'crockery-units', 
      name: 'Crockery Units', 
      icon: '🍽️', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 26
    },
    { 
      id: 'shoe-racks', 
      name: 'Shoe Racks', 
      icon: '👞', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 34
    },
    { 
      id: 'pooja-units', 
      name: 'Pooja Units', 
      icon: '🕉️', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 22
    },
    { 
      id: 'bathroom-vanities', 
      name: 'Bathroom Vanities', 
      icon: '🚿', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 30
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading interiors...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🏡</span>
            <div>
              <h1 className="page-title">Interiors</h1>
              <p className="page-subtitle">Complete interior solutions for your home</p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid - 4 columns, padding 0 24px */}
        <div className="subcategories-grid">
          {interiorsSubcategories.map((subcat) => (
            <Link
              key={subcat.id}
              to={`/category/interiors/subcategory/${subcat.id}/sellers`}
              className="subcategory-card"
            >
              <div className="subcategory-image">
                <img src={subcat.image} alt={subcat.name} />
                <div className="subcategory-overlay"></div>
              </div>

              <div className="subcategory-content">
                <div className="subcategory-icon">{subcat.icon}</div>
                <h3 className="subcategory-name">{subcat.name}</h3>
                <p className="subcategory-count">{subcat.productCount} Products</p>

                <div className="subcategory-action">
                  <span>Browse</span>
                  <MdChevronRight />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InteriorsCategory;


import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const LightingDecorCategory = () => {
  const [loading] = useState(false);

  const lightingDecorSubcategories = [
    { 
      id: 'ceiling-lights', 
      name: 'Ceiling Lights', 
      icon: '💡', 
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
      productCount: 48
    },
    { 
      id: 'table-lamps', 
      name: 'Table Lamps', 
      icon: '🕯️', 
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
      productCount: 56
    },
    { 
      id: 'floor-lamps', 
      name: 'Floor Lamps', 
      icon: '💡', 
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
      productCount: 42
    },
    { 
      id: 'wall-lights', 
      name: 'Wall Lights', 
      icon: '💡', 
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
      productCount: 38
    },
    { 
      id: 'chandeliers', 
      name: 'Chandeliers', 
      icon: '✨', 
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400&h=300&fit=crop',
      productCount: 32
    },
    { 
      id: 'decorative-items', 
      name: 'Decorative Items', 
      icon: '🎨', 
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=300&fit=crop',
      productCount: 64
    },
    { 
      id: 'wall-decor', 
      name: 'Wall Decor', 
      icon: '🖼️', 
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=300&fit=crop',
      productCount: 52
    },
    { 
      id: 'vases-planters', 
      name: 'Vases & Planters', 
      icon: '🏺', 
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
      productCount: 44
    },
    { 
      id: 'candles-holders', 
      name: 'Candles & Holders', 
      icon: '🕯️', 
      image: 'https://images.unsplash.com/photo-1602874801006-e7c0c1e3e8e5?w=400&h=300&fit=crop',
      productCount: 36
    },
    { 
      id: 'mirrors', 
      name: 'Decorative Mirrors', 
      icon: '🪞', 
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop',
      productCount: 28
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading lighting & decor...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>💡</span>
            <div>
              <h1 className="page-title">Lighting & Décor</h1>
              <p className="page-subtitle">Illuminate and beautify your space</p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid - 4 columns, padding 0 24px */}
        <div className="subcategories-grid">
          {lightingDecorSubcategories.map((subcat) => (
            <Link
              key={subcat.id}
              to={`/category/lighting-decor/subcategory/${subcat.id}/sellers`}
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

export default LightingDecorCategory;


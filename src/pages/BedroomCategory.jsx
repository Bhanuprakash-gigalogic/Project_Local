import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const BedroomCategory = () => {
  const [loading] = useState(false);

  const bedroomSubcategories = [
    { 
      id: 'beds', 
      name: 'Beds', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop',
      productCount: 89
    },
    { 
      id: 'tv-units', 
      name: 'TV Units', 
      icon: '📺', 
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
      productCount: 34
    },
    { 
      id: 'wardrobes', 
      name: 'Wardrobes', 
      icon: '🚪', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 56
    },
    { 
      id: 'bed-sheets', 
      name: 'Bed Sheets', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
      productCount: 78
    },
    { 
      id: 'mattress', 
      name: 'Mattress', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
      productCount: 45
    },
    { 
      id: 'bedside-tables', 
      name: 'Bedside Tables', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 32
    },
    { 
      id: 'photo-frames', 
      name: 'Photo Frames', 
      icon: '🖼️', 
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=300&fit=crop',
      productCount: 24
    },
    { 
      id: 'sofa-cum-beds', 
      name: 'Sofa Cum Beds', 
      icon: '🛋️', 
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      productCount: 18
    },
    { 
      id: 'trunk-blanket-box', 
      name: 'Trunk & Blanket Box', 
      icon: '📦', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 15
    },
    { 
      id: 'dressing-tables', 
      name: 'Dressing Tables', 
      icon: '💄', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'wall-mirrors', 
      name: 'Wall Mirrors', 
      icon: '🪞', 
      image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=400&h=300&fit=crop',
      productCount: 22
    },
    { 
      id: 'lamp-lighting', 
      name: 'Lamp and Lighting', 
      icon: '💡', 
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop',
      productCount: 36
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading bedroom furniture...</p>
      </div>
    );
  }

  return (
    <div className="categories-page page-container">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🛏️</span>
            <div>
              <h1 className="page-title">Bedroom Furniture</h1>
              <p className="page-subtitle">Buy Bedroom Furniture Sets that can add style and comfort to your home interior. Catching the best wooden fur...</p>
            </div>
          </div>
        </div>

        {/* Bedroom Subcategories Grid - 5 per row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '24px',
          marginTop: '32px'
        }}>
          {bedroomSubcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/category/bedroom/subcategory/${subcategory.id}/sellers`}
              className="category-card"
              style={{
                textDecoration: 'none',
                borderRadius: '16px',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
              }}
            >
              <div style={{ position: 'relative', paddingTop: '75%', overflow: 'hidden' }}>
                <img 
                  src={subcategory.image} 
                  alt={subcategory.name}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </div>

              <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {subcategory.icon}
                </div>
                <h3 style={{ 
                  fontSize: '16px', 
                  fontWeight: '600', 
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {subcategory.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Explore Different Beds Section */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            textAlign: 'center',
            marginBottom: '8px',
            color: '#333'
          }}>
            Explore Different Beds For Your Bedroom
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: '#666',
            marginBottom: '32px'
          }}>
            Make your Bedroom Vibe in Style
          </p>
        </div>
      </div>
    </div>
  );
};

export default BedroomCategory;


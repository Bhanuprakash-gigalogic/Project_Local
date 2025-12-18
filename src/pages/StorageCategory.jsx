import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const StorageCategory = () => {
  const [loading] = useState(false);

  const storageSubcategories = [
    { 
      id: 'tv-units', 
      name: 'TV Units', 
      icon: '📺', 
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
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
      id: 'chest-of-drawers', 
      name: 'Chest Of Drawers', 
      icon: '🗄️', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'shoe-stand', 
      name: 'Shoe Stand', 
      icon: '👞', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 24
    },
    { 
      id: 'cabinets-sideboards', 
      name: 'Cabinets & Sideboards', 
      icon: '🗄️', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 38
    },
    { 
      id: 'home-temple', 
      name: 'Home Temple', 
      icon: '🕉️', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 18
    },
    { 
      id: 'bookshelves', 
      name: 'Bookshelves', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
      productCount: 42
    },
    { 
      id: 'bar-cabinets', 
      name: 'Bar Cabinets', 
      icon: '🍷', 
      image: 'https://images.unsplash.com/photo-1572297794912-e0c6c8e8c3f7?w=400&h=300&fit=crop',
      productCount: 22
    },
    { 
      id: 'wall-shelves', 
      name: 'Wall Shelves', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
      productCount: 36
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading storage furniture...</p>
      </div>
    );
  }

  return (
    <div className="categories-page page-container">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🗄️</span>
            <div>
              <h1 className="page-title">Storage Furniture</h1>
              <p className="page-subtitle">Select the best storage furniture online by enhancing the charm of your home, as it... Read More</p>
            </div>
          </div>
        </div>

        {/* Storage Subcategories Grid - 5 per row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '24px',
          marginTop: '32px'
        }}>
          {storageSubcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/category/storage/subcategory/${subcategory.id}/sellers`}
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
              <div style={{ position: 'relative', paddingTop: '100%', overflow: 'hidden', borderRadius: '50%', margin: '20px auto', width: 'calc(100% - 40px)' }}>
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

              <div style={{ padding: '0 20px 20px', textAlign: 'center' }}>
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
      </div>
    </div>
  );
};

export default StorageCategory;


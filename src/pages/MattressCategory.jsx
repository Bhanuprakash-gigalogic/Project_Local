import { useState } from 'react';
import { Link } from 'react-router-dom';

const MattressCategory = () => {
  const [loading] = useState(false);

  const mattressSubcategories = [
    { 
      id: 'memory-foam', 
      name: 'Memory Foam Mattress', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop',
      productCount: 34
    },
    { 
      id: 'orthopedic', 
      name: 'Orthopedic Mattress', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'spring', 
      name: 'Spring Mattress', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop',
      productCount: 22
    },
    { 
      id: 'latex', 
      name: 'Latex Mattress', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400&h=300&fit=crop',
      productCount: 18
    },
    { 
      id: 'coir', 
      name: 'Coir Mattress', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=400&h=300&fit=crop',
      productCount: 15
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading mattresses...</p>
      </div>
    );
  }

  return (
    <div className="categories-page page-container">
      <div className="container">
        <div className="page-header">
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🛏️</span>
            <div>
              <h1 className="page-title">Mattress</h1>
              <p className="page-subtitle">Find the perfect mattress for a good night's sleep</p>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '24px',
          marginTop: '32px',
          padding: '0 24px',   // ✅ LEFT & RIGHT GAP
        }}>
          {mattressSubcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/category/mattress/subcategory/${subcategory.id}/sellers`}
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
      </div>
    </div>
  );
};

export default MattressCategory;


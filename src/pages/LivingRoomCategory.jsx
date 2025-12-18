import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const LivingCategory = () => {
  const [loading] = useState(false);

  const livingSubcategories = [
    { 
      id: 'sofa-sets', 
      name: 'Sofa Sets', 
      icon: '🛋️', 
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop',
      productCount: 32
    },
    { 
      id: 'coffee-tables', 
      name: 'Coffee Tables', 
      icon: '☕', 
      image: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'tv-units', 
      name: 'TV Units', 
      icon: '📺', 
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop',
      productCount: 24
    },
    { 
      id: 'wall-shelves', 
      name: 'Wall Shelves', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
      productCount: 18
    },
    { 
      id: 'recliners', 
      name: 'Recliners', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop',
      productCount: 15
    },
    { 
      id: 'lounge-chairs', 
      name: 'Lounge Chairs', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop',
      productCount: 22
    },
    { 
      id: 'side-tables', 
      name: 'Side Tables', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 19
    },
    { 
      id: 'fabric-sofas', 
      name: 'Fabric Sofas', 
      icon: '🛋️', 
      image: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&h=300&fit=crop',
      productCount: 26
    },
    { 
      id: 'benches', 
      name: 'Benches', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop',
      productCount: 12
    },
    { 
      id: 'bookshelves', 
      name: 'Bookshelves', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
      productCount: 16
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading living room furniture...</p>
      </div>
    );
  }

  return (
    <div className="categories-page page-container">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🛋️</span>
            <div>
              <h1 className="page-title">Living Room Furniture</h1>
              <p className="page-subtitle">Transform your living space</p>
            </div>
          </div>
        </div>

        {/* Living Subcategories Grid - 5 per row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '24px',
          marginTop: '32px'
        }}>
          {livingSubcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/category/living/subcategory/${subcategory.id}/sellers`}
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
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0), rgba(0,0,0,0.3))',
                }}></div>
              </div>

              <div style={{ padding: '20px' }}>
                <div style={{ 
                  fontSize: '32px', 
                  marginBottom: '8px',
                  textAlign: 'center'
                }}>
                  {subcategory.icon}
                </div>
                <h3 style={{ 
                  fontSize: '18px', 
                  fontWeight: '700', 
                  color: '#333',
                  marginBottom: '8px',
                  textAlign: 'center'
                }}>
                  {subcategory.name}
                </h3>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  color: '#666',
                  fontSize: '14px',
                  marginBottom: '12px'
                }}>
                  <span>{subcategory.productCount} Products</span>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  color: '#8B4513',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  <span>Explore</span>
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

export default LivingCategory;


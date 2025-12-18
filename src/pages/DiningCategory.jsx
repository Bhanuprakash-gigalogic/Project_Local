import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const DiningCategory = () => {
  const [loading] = useState(false);

  const diningSubcategories = [
    { 
      id: '6-seater-dining-table-sets', 
      name: '6 Seater Dining Table Sets', 
      icon: '🍽️', 
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop',
      productCount: 45
    },
    { 
      id: 'modular-kitchen', 
      name: 'Modular Kitchen', 
      icon: '🏠', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'dining-tables', 
      name: 'Dining Tables', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop',
      productCount: 56
    },
    { 
      id: 'bar-cabinets', 
      name: 'Bar Cabinets', 
      icon: '🍷', 
      image: 'https://images.unsplash.com/photo-1572297794912-e0c6c8e8c3f7?w=400&h=300&fit=crop',
      productCount: 22
    },
    { 
      id: 'bar-trolleys', 
      name: 'Bar Trolleys', 
      icon: '🛒', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 18
    },
    { 
      id: 'crockery-units', 
      name: 'Crockery Units', 
      icon: '🍽️', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 32
    },
    { 
      id: '4-seater-dining-table-sets', 
      name: '4 Seater Dining Table Sets', 
      icon: '🍽️', 
      image: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400&h=300&fit=crop',
      productCount: 38
    },
    { 
      id: 'kitchen-cabinet', 
      name: 'Kitchen Cabinet', 
      icon: '🗄️', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      productCount: 24
    },
    { 
      id: 'dining-chairs', 
      name: 'Dining Chairs', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop',
      productCount: 42
    },
    { 
      id: 'kitchen-shelves', 
      name: 'Kitchen Shelves', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
      productCount: 26
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading dining furniture...</p>
      </div>
    );
  }

  return (
    <div className="categories-page page-container">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🍽️</span>
            <div>
              <h1 className="page-title">Dining Room Furniture</h1>
              <p className="page-subtitle">Wooden Dining Room Furniture embrace mood and decorum at the table in the way you want whether it's about...</p>
            </div>
          </div>
        </div>

        {/* Dining Subcategories Grid - 5 per row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '24px',
          marginTop: '32px'
        }}>
          {diningSubcategories.map((subcategory) => (
            <Link
              key={subcategory.id}
              to={`/category/dining/subcategory/${subcategory.id}/sellers`}
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

        {/* Popular Picks Section */}
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            textAlign: 'center',
            marginBottom: '8px',
            color: '#333'
          }}>
            Popular Picks in Dining Furniture
          </h2>
          <p style={{ 
            textAlign: 'center', 
            color: '#666',
            marginBottom: '32px'
          }}>
            Design Your Home Decor, Your Way
          </p>
        </div>
      </div>
    </div>
  );
};

export default DiningCategory;


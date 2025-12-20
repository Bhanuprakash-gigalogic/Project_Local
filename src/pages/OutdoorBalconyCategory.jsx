import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const OutdoorBalconyCategory = () => {
  const [loading] = useState(false);

  const outdoorBalconySubcategories = [
    { 
      id: 'outdoor-seating', 
      name: 'Outdoor Seating', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
      productCount: 45
    },
    { 
      id: 'patio-furniture', 
      name: 'Patio Furniture', 
      icon: '🌿', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 38
    },
    { 
      id: 'garden-benches', 
      name: 'Garden Benches', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'outdoor-tables', 
      name: 'Outdoor Tables', 
      icon: '🍽️', 
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
      productCount: 32
    },
    { 
      id: 'balcony-chairs', 
      name: 'Balcony Chairs', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
      productCount: 24
    },
    { 
      id: 'outdoor-storage', 
      name: 'Outdoor Storage', 
      icon: '📦', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 18
    },
    { 
      id: 'planters', 
      name: 'Planters & Stands', 
      icon: '🌱', 
      image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop',
      productCount: 36
    },
    { 
      id: 'swing-chairs', 
      name: 'Swing Chairs', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&h=300&fit=crop',
      productCount: 22
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading outdoor & balcony furniture...</p>
      </div>
    );
  }

  return (
    <div className="categories-page page-container">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🌿</span>
            <div>
              <h1 className="page-title">Outdoor & Balcony Furniture</h1>
              <p className="page-subtitle">Transform your outdoor space</p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid */}
        <div className="subcategories-grid">
          {outdoorBalconySubcategories.map((subcat) => (
            <Link
              key={subcat.id}
              to={`/category/outdoor-balcony/subcategory/${subcat.id}/sellers`}
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

export default OutdoorBalconyCategory;


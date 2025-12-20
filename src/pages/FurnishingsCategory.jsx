import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const FurnishingsCategory = () => {
  const [loading] = useState(false);

  const furnishingsSubcategories = [
    { 
      id: 'curtains-drapes', 
      name: 'Curtains & Drapes', 
      icon: '🪟', 
      image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop',
      productCount: 52
    },
    { 
      id: 'cushions-covers', 
      name: 'Cushions & Covers', 
      icon: '🛋️', 
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop',
      productCount: 68
    },
    { 
      id: 'bed-linen', 
      name: 'Bed Linen', 
      icon: '🛏️', 
      image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop',
      productCount: 74
    },
    { 
      id: 'rugs-carpets', 
      name: 'Rugs & Carpets', 
      icon: '🧶', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 46
    },
    { 
      id: 'table-linen', 
      name: 'Table Linen', 
      icon: '🍽️', 
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=400&h=300&fit=crop',
      productCount: 38
    },
    { 
      id: 'throws-blankets', 
      name: 'Throws & Blankets', 
      icon: '🧣', 
      image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop',
      productCount: 42
    },
    { 
      id: 'wall-art', 
      name: 'Wall Art & Tapestry', 
      icon: '🖼️', 
      image: 'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=300&fit=crop',
      productCount: 56
    },
    { 
      id: 'door-mats', 
      name: 'Door Mats', 
      icon: '🚪', 
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop',
      productCount: 24
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading furnishings...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>🎨</span>
            <div>
              <h1 className="page-title">Furnishings</h1>
              <p className="page-subtitle">Add comfort and style to your home</p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid - 4 columns, padding 0 24px */}
        <div className="subcategories-grid">
          {furnishingsSubcategories.map((subcat) => (
            <Link
              key={subcat.id}
              to={`/category/furnishings/subcategory/${subcat.id}/sellers`}
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

export default FurnishingsCategory;


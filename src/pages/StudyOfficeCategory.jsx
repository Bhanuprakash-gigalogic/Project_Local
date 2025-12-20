import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdChevronRight } from 'react-icons/md';

const StudyOfficeCategory = () => {
  const [loading] = useState(false);

  const studyOfficeSubcategories = [
    { 
      id: 'office-desks', 
      name: 'Office Desks', 
      icon: '🖥️', 
      image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400&h=300&fit=crop',
      productCount: 42
    },
    { 
      id: 'office-chairs', 
      name: 'Office Chairs', 
      icon: '🪑', 
      image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop',
      productCount: 56
    },
    { 
      id: 'bookshelves', 
      name: 'Bookshelves', 
      icon: '📚', 
      image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=400&h=300&fit=crop',
      productCount: 38
    },
    { 
      id: 'filing-cabinets', 
      name: 'Filing Cabinets', 
      icon: '🗄️', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 24
    },
    { 
      id: 'study-tables', 
      name: 'Study Tables', 
      icon: '📖', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 34
    },
    { 
      id: 'computer-tables', 
      name: 'Computer Tables', 
      icon: '💻', 
      image: 'https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=400&h=300&fit=crop',
      productCount: 28
    },
    { 
      id: 'office-storage', 
      name: 'Office Storage', 
      icon: '📦', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 32
    },
    { 
      id: 'desk-organizers', 
      name: 'Desk Organizers', 
      icon: '📎', 
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&h=300&fit=crop',
      productCount: 18
    },
  ];

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading study & office furniture...</p>
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header" style={{ paddingLeft: '24px', paddingRight: '24px' }}>
          <div className="page-header-content">
            <span style={{ fontSize: '48px' }}>💼</span>
            <div>
              <h1 className="page-title">Study & Office Furniture</h1>
              <p className="page-subtitle">Create your productive workspace</p>
            </div>
          </div>
        </div>

        {/* Subcategories Grid - 4 columns, padding 0 24px */}
        <div className="subcategories-grid">
          {studyOfficeSubcategories.map((subcat) => (
            <Link
              key={subcat.id}
              to={`/category/study-office/subcategory/${subcat.id}/sellers`}
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

export default StudyOfficeCategory;


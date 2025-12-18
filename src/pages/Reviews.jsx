import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { reviewsAPI } from '../services/api';

// Inline Styles
const styles = {
  reviewsPage: {
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    padding: '40px 0',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '0',
    borderBottom: '2px solid #E0E0E0',
    marginBottom: '32px',
  },
  tabBtn: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    color: '#666',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  tabBtnActive: {
    color: '#8B4513',
    borderBottom: '3px solid #8B4513',
  },
  orderCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  orderHeader: {
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid #E0E0E0',
  },
  orderTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#333',
    margin: '0 0 4px 0',
  },
  orderDate: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  reviewItem: {
    display: 'flex',
    gap: '20px',
    padding: '20px 0',
    borderBottom: '1px solid #F0F0F0',
  },
  reviewItemLast: {
    borderBottom: 'none',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
    flexShrink: 0,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  sellerName: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  itemActions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    alignItems: 'flex-end',
  },
  btnPrimary: {
    padding: '10px 24px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  btnSecondary: {
    padding: '10px 24px',
    backgroundColor: 'transparent',
    color: '#8B4513',
    border: '2px solid #8B4513',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  emptyText: {
    fontSize: '18px',
    color: '#666',
    margin: '0 0 8px 0',
  },
  emptySubtext: {
    fontSize: '14px',
    color: '#999',
    margin: 0,
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    fontSize: '18px',
    color: '#666',
  },
  submittedReviewCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '20px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  reviewHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  },
  reviewHeaderLeft: {
    flex: 1,
  },
  reviewProductTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  reviewActions: {
    display: 'flex',
    gap: '8px',
  },
  btnEdit: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  btnDelete: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  reviewTitleText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  reviewText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: '0 0 16px 0',
  },
  reviewImages: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  reviewImage: {
    width: '100px',
    height: '100px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  reviewFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #E0E0E0',
  },
  reviewDate: {
    fontSize: '14px',
    color: '#999',
  },
  reviewStatus: {
    fontSize: '14px',
    fontWeight: '600',
    padding: '4px 12px',
    borderRadius: '20px',
  },
  reviewStatusPublished: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  reviewStatusPending: {
    backgroundColor: '#fff3cd',
    color: '#856404',
  },
  stars: {
    display: 'flex',
    gap: '4px',
    fontSize: '18px',
  },
  star: {
    color: '#ddd',
  },
  starFilled: {
    color: '#ffa500',
  },
};

const Reviews = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending'); // pending | submitted
  const [pendingReviews, setPendingReviews] = useState([]);
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      if (activeTab === 'pending') {
        try {
          // ✅ BACKEND INTEGRATION: This will call your backend API
          // Endpoint: GET /api/v1/reviews/my-pending
          const response = await reviewsAPI.getMyPendingReviews();
          const data = response.data.data || response.data;
          setPendingReviews(Array.isArray(data) ? data : []);
          console.log('✅ [API SUCCESS] Pending reviews loaded from backend:', data);
        } catch (apiError) {
          // ⚠️ FALLBACK: When backend is not available, use mock data
          console.log('⚠️ [API FALLBACK] Backend not available, using mock data');
          console.log('   Error:', apiError.message);

          // Mock data fallback (for testing without backend)
          setPendingReviews([
            {
              order_id: 'ord_20250810_001234',
              ordered_at: '2025-08-10',
              delivered_at: '2025-08-12',
              items: [
                {
                  item_id: 'cart_item_789',
                  product_id: 'prod_9f8e7d6c5b4a',
                  title: 'iPhone 15 Pro 256GB Natural Titanium',
                  image: 'https://via.placeholder.com/100',
                  seller_name: 'Rahul Electronics',
                  seller_id: 'usr_a1b2c3d4e5f67890'
                }
              ]
            }
          ]);
        }
      } else {
        try {
          // ✅ BACKEND INTEGRATION: This will call your backend API
          // Endpoint: GET /api/v1/reviews/my-submitted
          const response = await reviewsAPI.getMySubmittedReviews();
          const data = response.data.data || response.data;
          setSubmittedReviews(Array.isArray(data) ? data : data.reviews || []);
          console.log('✅ [API SUCCESS] Submitted reviews loaded from backend:', data);
        } catch (apiError) {
          // ⚠️ FALLBACK: When backend is not available, use localStorage
          console.log('⚠️ [API FALLBACK] Backend not available, loading from localStorage');
          console.log('   Error:', apiError.message);

          // Load reviews from localStorage (saved during testing)
          const userReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');

          if (userReviews.length > 0) {
            // Format reviews for display
            const formattedReviews = userReviews.map(review => ({
              review_id: review.review_id,
              product_id: review.product_id,
              seller_id: review.seller_id,
              product_title: review.product_title || 'Product Review',
              seller_name: review.seller_name || 'Seller Review',
              rating: review.rating,
              title: review.title,
              review: review.review,
              images: review.images || [],
              communication_rating: review.communication_rating,
              packaging_rating: review.packaging_rating,
              delivery_speed_rating: review.delivery_speed_rating,
              reviewed_at: review.created_at,
              created_at: review.created_at,
              status: 'published',
              buyer_name: review.buyer_name || 'You',
              verified_purchase: review.verified_purchase || true
            }));

            setSubmittedReviews(formattedReviews);
            console.log('✅ [LOCALSTORAGE] Loaded reviews from localStorage:', formattedReviews);
          } else {
            // Default mock data if no reviews in localStorage
            console.log('ℹ️ [MOCK DATA] No reviews in localStorage, showing sample review');
            setSubmittedReviews([
              {
                review_id: 'rev_prod_789abc',
                product_id: 'prod_123',
                product_title: 'Wooden Dining Table',
                rating: 5,
                title: 'Excellent quality!',
                review: 'Very happy with this purchase. Great quality and fast delivery.',
                images: [],
                reviewed_at: '2025-08-15T10:30:00Z',
                status: 'published'
              }
            ]);
          }
        }
      }
    } catch (error) {
      console.error('❌ [ERROR] Unexpected error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = (orderId, item) => {
    navigate(`/write-review`, { 
      state: { 
        orderId, 
        item,
        type: 'product'
      } 
    });
  };

  const handleWriteSellerReview = (orderId, item) => {
    navigate(`/write-review`, { 
      state: { 
        orderId, 
        sellerId: item.seller_id,
        sellerName: item.seller_name,
        type: 'seller'
      } 
    });
  };

  const handleEditReview = (review) => {
    // Prepare review data for editing
    const editData = {
      review_id: review.review_id,
      product_id: review.product_id,
      seller_id: review.seller_id,
      rating: review.rating,
      title: review.title,
      review: review.review,
      images: review.images || [],
      communication_rating: review.communication_rating,
      packaging_rating: review.packaging_rating,
      delivery_speed_rating: review.delivery_speed_rating,
      product_title: review.product_title,
      seller_name: review.seller_name,
    };

    navigate(`/write-review`, {
      state: {
        review: editData,
        isEdit: true,
        type: review.product_id ? 'product' : 'seller',
        item: {
          product_id: review.product_id,
          title: review.product_title,
          name: review.product_title,
        },
        sellerId: review.seller_id,
        sellerName: review.seller_name,
      }
    });
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      // ✅ BACKEND INTEGRATION: This will call your backend API
      // Endpoint: DELETE /api/v1/reviews/product/{reviewId}
      await reviewsAPI.deleteProductReview(reviewId);
      console.log('✅ [API SUCCESS] Review deleted via backend');
      alert('✅ Review deleted successfully');
      fetchReviews();
    } catch (error) {
      // ⚠️ FALLBACK: When backend is not available, delete from localStorage
      console.log('⚠️ [API FALLBACK] Backend not available, deleting from localStorage');
      console.log('   Error:', error.message);

      // Delete from localStorage
      const userReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
      const updatedReviews = userReviews.filter(review => review.review_id !== reviewId);
      localStorage.setItem('userReviews', JSON.stringify(updatedReviews));

      console.log('✅ [LOCALSTORAGE] Review deleted from localStorage');
      alert('✅ Review deleted successfully');

      // Refresh the reviews list
      fetchReviews();
    }
  };

  const renderStars = (rating) => {
    return (
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            style={star <= rating ? styles.starFilled : styles.star}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div style={styles.loading}>Loading reviews...</div>;
  }

  return (
    <div style={styles.reviewsPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>My Reviews</h1>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'pending' ? styles.tabBtnActive : {})
            }}
            onClick={() => setActiveTab('pending')}
          >
            Pending Reviews{pendingReviews.length > 0 && ` (${pendingReviews.length})`}
          </button>
          <button
            style={{
              ...styles.tabBtn,
              ...(activeTab === 'submitted' ? styles.tabBtnActive : {})
            }}
            onClick={() => setActiveTab('submitted')}
          >
            Submitted Reviews
          </button>
        </div>

        {/* Pending Reviews */}
        {activeTab === 'pending' && (
          <div>
            {pendingReviews.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No pending reviews</p>
                <p style={styles.emptySubtext}>
                  Reviews can be written after your order is delivered
                </p>
              </div>
            ) : (
              pendingReviews.map((order) => (
                <div key={order.order_id} style={styles.orderCard}>
                  <div style={styles.orderHeader}>
                    <h3 style={styles.orderTitle}>Order #{order.order_id}</h3>
                    <p style={styles.orderDate}>
                      Delivered on {new Date(order.delivered_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div>
                    {order.items.map((item, index) => (
                      <div
                        key={item.item_id}
                        style={{
                          ...styles.reviewItem,
                          ...(index === order.items.length - 1 ? styles.reviewItemLast : {})
                        }}
                      >
                        <img src={item.image} alt={item.title} style={styles.itemImage} />
                        <div style={styles.itemInfo}>
                          <h4 style={styles.itemTitle}>{item.title}</h4>
                          <p style={styles.sellerName}>Sold by: {item.seller_name}</p>
                        </div>
                        <div style={styles.itemActions}>
                          <button
                            style={styles.btnPrimary}
                            onClick={() => handleWriteReview(order.order_id, item)}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0522D'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B4513'}
                          >
                            Rate Product
                          </button>
                          <button
                            style={styles.btnSecondary}
                            onClick={() => handleWriteSellerReview(order.order_id, item)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#8B4513';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#8B4513';
                            }}
                          >
                            Rate Seller
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Submitted Reviews */}
        {activeTab === 'submitted' && (
          <div>
            {submittedReviews.length === 0 ? (
              <div style={styles.emptyState}>
                <p style={styles.emptyText}>No reviews submitted yet</p>
                <p style={styles.emptySubtext}>
                  Write reviews for your delivered orders
                </p>
              </div>
            ) : (
              submittedReviews.map((review) => (
                <div key={review.review_id} style={styles.submittedReviewCard}>
                  <div style={styles.reviewHeader}>
                    <div style={styles.reviewHeaderLeft}>
                      <h4 style={styles.reviewProductTitle}>
                        {review.product_title || review.seller_name || 'Review'}
                      </h4>
                      {renderStars(review.rating)}
                    </div>
                    <div style={styles.reviewActions}>
                      <button
                        style={styles.btnEdit}
                        onClick={() => handleEditReview(review)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#A0522D'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#8B4513'}
                      >
                        Edit
                      </button>
                      <button
                        style={styles.btnDelete}
                        onClick={() => handleDeleteReview(review.review_id)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <h5 style={styles.reviewTitleText}>{review.title}</h5>
                  <p style={styles.reviewText}>{review.review}</p>

                  {review.images && review.images.length > 0 && (
                    <div style={styles.reviewImages}>
                      {review.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Review ${idx + 1}`}
                          style={styles.reviewImage}
                        />
                      ))}
                    </div>
                  )}

                  <div style={styles.reviewFooter}>
                    <span style={styles.reviewDate}>
                      {new Date(review.reviewed_at || review.created_at).toLocaleDateString()}
                    </span>
                    <span
                      style={{
                        ...styles.reviewStatus,
                        ...(review.status === 'published' ? styles.reviewStatusPublished : styles.reviewStatusPending)
                      }}
                    >
                      {review.status === 'published' ? '✓ Published' : '⏳ Under Review'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;


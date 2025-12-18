import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { reviewsAPI } from '../services/api';

// Inline Styles
const styles = {
  writeReviewPage: {
    backgroundColor: '#FAFAFA',
    minHeight: '100vh',
    padding: '40px 0',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '0 20px',
  },
  pageTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '24px',
  },
  productInfo: {
    display: 'flex',
    gap: '16px',
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  productImage: {
    width: '80px',
    height: '80px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  reviewForm: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  starsInput: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  star: {
    fontSize: '32px',
    color: '#E0E0E0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  starFilled: {
    fontSize: '32px',
    color: '#FFA500',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #D0D0D0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '16px',
    border: '1px solid #D0D0D0',
    borderRadius: '8px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
  },
  helpText: {
    fontSize: '13px',
    color: '#666',
    marginTop: '8px',
  },
  uploadArea: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '16px',
    marginTop: '12px',
  },
  imagePreview: {
    position: 'relative',
    width: '120px',
    height: '120px',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  removeImageBtn: {
    position: 'absolute',
    top: '4px',
    right: '4px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadBtn: {
    width: '120px',
    height: '120px',
    border: '2px dashed #D0D0D0',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: '#F9F9F9',
    transition: 'all 0.3s ease',
  },
  uploadBtnText: {
    fontSize: '14px',
    color: '#666',
    textAlign: 'center',
  },
  submitBtn: {
    padding: '14px 32px',
    backgroundColor: '#FFD814',
    color: '#0F1111',
    border: '1px solid #FCD200',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
  },
};

const WriteReview = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, item, sellerId, sellerName, review, isEdit, type } = location.state || {};

  const [reviewType, setReviewType] = useState(type || 'product'); // product | seller
  const [rating, setRating] = useState(review?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(review?.title || '');
  const [reviewText, setReviewText] = useState(review?.review || '');
  const [images, setImages] = useState([]);
  const [imagePreview, setImagePreview] = useState(review?.images || []);
  const [tags, setTags] = useState(review?.tags || []);
  const [loading, setLoading] = useState(false);

  // Seller-specific ratings
  const [communicationRating, setCommunicationRating] = useState(review?.communication_rating || 0);
  const [packagingRating, setPackagingRating] = useState(review?.packaging_rating || 0);
  const [deliverySpeedRating, setDeliverySpeedRating] = useState(review?.delivery_speed_rating || 0);

  const availableTags = [
    'fast_delivery',
    'genuine',
    'well_packaged',
    'good_quality',
    'value_for_money',
    'excellent_service',
    'as_described',
    'highly_recommended'
  ];

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + images.length > 5) {
      alert('You can upload maximum 5 images');
      return;
    }

    // Validate file size (max 5MB each)
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert('Each image must be less than 5MB');
      return;
    }

    setImages([...images, ...files]);

    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...previews]);
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreview.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreview(newPreviews);
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter(t => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    if (!title.trim() || !reviewText.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      if (reviewType === 'product') {
        // Create FormData for product review with images
        const formData = new FormData();
        formData.append('order_id', orderId);
        formData.append('item_id', item.item_id);
        formData.append('product_id', item.product_id);
        formData.append('rating', rating);
        formData.append('title', title);
        formData.append('review', reviewText);

        // Add images
        images.forEach((image) => {
          formData.append('images', image);
        });

        // Add tags
        tags.forEach((tag) => {
          formData.append('tags', tag);
        });

        try {
          // ✅ BACKEND INTEGRATION: This will call your backend API
          let response;
          if (isEdit) {
            // Endpoint: PUT /api/v1/reviews/product/{reviewId}
            console.log('📤 [API CALL] Updating product review via backend...');
            response = await reviewsAPI.editProductReview(review.review_id, formData);
          } else {
            // Endpoint: POST /api/v1/reviews/product
            console.log('📤 [API CALL] Submitting product review via backend...');
            response = await reviewsAPI.submitProductReview(formData);
          }

          const responseData = response.data.data || response.data;
          console.log('✅ [API SUCCESS] Product review submitted:', responseData);

          alert(responseData.message || 'Review submitted successfully!');
          navigate('/reviews');
        } catch (apiError) {
          // ⚠️ FALLBACK: When backend is not available, use localStorage
          console.log('⚠️ [API FALLBACK] Backend not available, using localStorage');
          console.log('   Error:', apiError.message);

          if (isEdit) {
            // Update existing review in localStorage
            const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
            const reviewIndex = existingReviews.findIndex(r => r.review_id === review.review_id);

            if (reviewIndex !== -1) {
              existingReviews[reviewIndex] = {
                ...existingReviews[reviewIndex],
                rating,
                title,
                review: reviewText,
                images: imagePreview,
                tags,
                updated_at: new Date().toISOString(),
              };

              localStorage.setItem('userReviews', JSON.stringify(existingReviews));
              console.log('✅ [LOCALSTORAGE] Review updated in localStorage');
              alert('✅ Review updated successfully!');
            } else {
              console.error('❌ [ERROR] Review not found in localStorage');
              alert('❌ Review not found');
            }
          } else {
            // Create new review in localStorage
            const mockReview = {
              review_id: `review_${Date.now()}`,
              product_id: item.product_id,
              product_title: item.title || item.name || 'Product Review',
              order_id: orderId,
              item_id: item.item_id,
              rating,
              title,
              review: reviewText,
              images: imagePreview,
              tags,
              created_at: new Date().toISOString(),
              reviewed_at: new Date().toISOString(),
              buyer_name: 'You',
              verified_purchase: true,
              status: 'published'
            };

            // Save to localStorage
            const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
            existingReviews.push(mockReview);
            localStorage.setItem('userReviews', JSON.stringify(existingReviews));

            console.log('✅ [LOCALSTORAGE] Review saved to localStorage:', mockReview);
            alert('✅ Review submitted successfully!');
          }

          navigate('/reviews');
        }

      } else {
        // Seller review (JSON only)
        const sellerReviewData = {
          order_id: orderId,
          seller_id: sellerId,
          rating,
          title,
          review: reviewText,
          communication_rating: communicationRating,
          packaging_rating: packagingRating,
          delivery_speed_rating: deliverySpeedRating
        };

        try {
          // ✅ BACKEND INTEGRATION: This will call your backend API
          let response;
          if (isEdit) {
            // Endpoint: PUT /api/v1/reviews/seller/{reviewId}
            console.log('📤 [API CALL] Updating seller review via backend...');
            response = await reviewsAPI.editSellerReview(review.review_id, sellerReviewData);
          } else {
            // Endpoint: POST /api/v1/reviews/seller
            console.log('📤 [API CALL] Submitting seller review via backend...');
            response = await reviewsAPI.submitSellerReview(sellerReviewData);
          }

          const responseData = response.data.data || response.data;

          console.log('✅ [API SUCCESS] Seller review submitted:', responseData);

          alert(responseData.message || 'Seller review submitted successfully!');
          navigate('/reviews');
        } catch (apiError) {
          // ⚠️ FALLBACK: When backend is not available, use localStorage
          console.log('⚠️ [API FALLBACK] Backend not available, using localStorage');
          console.log('   Error:', apiError.message);

          if (isEdit) {
            // Update existing review in localStorage
            const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
            const reviewIndex = existingReviews.findIndex(r => r.review_id === review.review_id);

            if (reviewIndex !== -1) {
              existingReviews[reviewIndex] = {
                ...existingReviews[reviewIndex],
                rating,
                title,
                review: reviewText,
                communication_rating: communicationRating,
                packaging_rating: packagingRating,
                delivery_speed_rating: deliverySpeedRating,
                updated_at: new Date().toISOString(),
              };

              localStorage.setItem('userReviews', JSON.stringify(existingReviews));
              console.log('✅ [LOCALSTORAGE] Seller review updated in localStorage');
              alert('✅ Seller review updated successfully!');
            } else {
              console.error('❌ [ERROR] Review not found in localStorage');
              alert('❌ Review not found');
            }
          } else {
            // Create new review in localStorage
            const mockReview = {
              review_id: `review_${Date.now()}`,
              seller_id: sellerId,
              seller_name: sellerName || 'Seller Review',
              order_id: orderId,
              rating,
              title,
              review: reviewText,
              communication_rating: communicationRating,
              packaging_rating: packagingRating,
              delivery_speed_rating: deliverySpeedRating,
              created_at: new Date().toISOString(),
              reviewed_at: new Date().toISOString(),
              buyer_name: 'You',
              status: 'published'
            };

            // Save to localStorage
            const existingReviews = JSON.parse(localStorage.getItem('userReviews') || '[]');
            existingReviews.push(mockReview);
            localStorage.setItem('userReviews', JSON.stringify(existingReviews));

            console.log('✅ [LOCALSTORAGE] Seller review saved to localStorage:', mockReview);
            alert('✅ Seller review submitted successfully!');
          }

          navigate('/reviews');
        }
      }

    } catch (error) {
      console.error('❌ Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = (currentRating, setRatingFunc, label) => {
    return (
      <div style={styles.formGroup}>
        <label style={styles.label}>{label}</label>
        <div style={styles.starsInput}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              style={star <= (hoverRating || currentRating) ? styles.starFilled : styles.star}
              onClick={() => setRatingFunc(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={styles.writeReviewPage}>
      <div style={styles.container}>
        <h1 style={styles.pageTitle}>How was the item?</h1>

        {reviewType === 'product' && item && (
          <div style={styles.productInfo}>
            <img src={item.image} alt={item.title} style={styles.productImage} />
            <div style={styles.productDetails}>
              <h3 style={styles.productTitle}>{item.title}</h3>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.reviewForm}>
          {/* Overall Rating */}
          {renderStarRating(rating, setRating, 'Overall Rating')}

            {/* Review Text */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Write a review</label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="What should other customers know?"
                rows={6}
                maxLength={1000}
                required
                style={styles.textarea}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8B4513'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D0D0D0'}
              />
            </div>

            {/* Image Upload (Product reviews only) */}
            {reviewType === 'product' && (
              <div style={styles.formGroup}>
                <label style={styles.label}>Share a video or photo</label>
                <p style={styles.helpText}>Shoppers find images and videos more helpful than text alone.</p>

                <div style={styles.uploadArea}>
                  {imagePreview.map((preview, index) => (
                    <div key={index} style={styles.imagePreview}>
                      <img src={preview} alt={`Preview ${index + 1}`} style={styles.previewImage} />
                      <button
                        type="button"
                        style={styles.removeImageBtn}
                        onClick={() => removeImage(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <label style={styles.uploadBtn}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageUpload}
                        style={{ display: 'none' }}
                      />
                      <div style={styles.uploadBtnText}>
                        <div style={{fontSize: '32px', marginBottom: '8px'}}>📷</div>
                        <div>Your video could be the first. Imagine that...</div>
                      </div>
                    </label>
                  )}
                </div>
              </div>
            )}

            {/* Review Title */}
            <div style={styles.formGroup}>
              <label style={styles.label}>Title your review (required)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's most important to know?"
                maxLength={100}
                required
                style={styles.input}
                onFocus={(e) => e.currentTarget.style.borderColor = '#8B4513'}
                onBlur={(e) => e.currentTarget.style.borderColor = '#D0D0D0'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              style={styles.submitBtn}
              disabled={loading}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7CA00'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFD814'}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
      </div>
    </div>
  );
};

export default WriteReview;


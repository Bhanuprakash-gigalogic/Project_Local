import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCreditCard, MdAccountBalance, MdMoreVert, MdAdd } from 'react-icons/md';

const ManagePayments = () => {
  const navigate = useNavigate();
  const [savedCards, setSavedCards] = useState([
    { id: 1, last4: '1234', expiry: '08/26', type: 'visa', isDefault: false },
    { id: 2, last4: '5678', expiry: '10/25', type: 'mastercard', isDefault: true },
  ]);
  const [savedUPI, setSavedUPI] = useState([
    { id: 1, upiId: 'john@oksbi', isDefault: false },
  ]);

  const toggleCardDefault = (cardId) => {
    setSavedCards(cards => 
      cards.map(card => ({
        ...card,
        isDefault: card.id === cardId
      }))
    );
  };

  const toggleUPIDefault = (upiId) => {
    setSavedUPI(upis => 
      upis.map(upi => ({
        ...upi,
        isDefault: upi.id === upiId
      }))
    );
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <MdArrowBack />
          </button>
          <h1 style={styles.headerTitle}>Manage Payments</h1>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Saved Cards Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Saved Cards</h2>
            
            {savedCards.map((card) => (
              <div key={card.id} style={styles.paymentCard}>
                <div style={styles.cardLeft}>
                  <div style={styles.toggleContainer}>
                    <div
                      style={{
                        ...styles.toggle,
                        ...(card.isDefault ? styles.toggleActive : {})
                      }}
                      onClick={() => toggleCardDefault(card.id)}
                    >
                      <div style={{
                        ...styles.toggleCircle,
                        ...(card.isDefault ? styles.toggleCircleActive : {})
                      }}></div>
                    </div>
                  </div>
                  <div style={styles.cardIcon}>
                    <MdCreditCard style={{fontSize: '28px', color: '#666'}} />
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardNumber}>•••• •••• •••• {card.last4}</h3>
                    <p style={styles.cardExpiry}>Expires {card.expiry}</p>
                  </div>
                </div>
                <button style={styles.moreBtn}>
                  <MdMoreVert />
                </button>
              </div>
            ))}
          </div>

          {/* Saved UPI Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Saved UPI IDs</h2>
            
            {savedUPI.map((upi) => (
              <div key={upi.id} style={styles.paymentCard}>
                <div style={styles.cardLeft}>
                  <div style={styles.toggleContainer}>
                    <div
                      style={{
                        ...styles.toggle,
                        ...(upi.isDefault ? styles.toggleActive : {})
                      }}
                      onClick={() => toggleUPIDefault(upi.id)}
                    >
                      <div style={{
                        ...styles.toggleCircle,
                        ...(upi.isDefault ? styles.toggleCircleActive : {})
                      }}></div>
                    </div>
                  </div>
                  <div style={styles.cardIcon}>
                    <MdAccountBalance style={{fontSize: '28px', color: '#666'}} />
                  </div>
                  <div style={styles.cardInfo}>
                    <h3 style={styles.cardNumber}>{upi.upiId}</h3>
                    <p style={styles.cardExpiry}>UPI ID</p>
                  </div>
                </div>
                <button style={styles.moreBtn}>
                  <MdMoreVert />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Payment Method Button */}
          <button style={styles.addBtn} onClick={() => navigate('/payment-methods/add')}>
            <MdAdd style={{fontSize: '24px'}} />
            <span>Add New Payment Method</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F5F5',
    minHeight: '100vh',
    paddingBottom: '40px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    minHeight: '100vh',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    borderBottom: '1px solid #E0E0E0',
    backgroundColor: 'white',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    marginRight: '12px',
    display: 'flex',
    alignItems: 'center',
    color: '#333',
  },
  headerTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  content: {
    padding: '20px',
  },
  section: {
    marginBottom: '32px',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '16px',
  },
  paymentCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    backgroundColor: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '12px',
    marginBottom: '12px',
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flex: 1,
  },
  toggleContainer: {
    flexShrink: 0,
  },
  toggle: {
    width: '44px',
    height: '24px',
    backgroundColor: '#ccc',
    borderRadius: '24px',
    cursor: 'pointer',
    position: 'relative',
    transition: 'background-color 0.3s ease',
  },
  toggleActive: {
    backgroundColor: '#4CAF50',
  },
  toggleCircle: {
    width: '18px',
    height: '18px',
    backgroundColor: 'white',
    borderRadius: '50%',
    position: 'absolute',
    top: '3px',
    left: '3px',
    transition: 'transform 0.3s ease',
  },
  toggleCircleActive: {
    transform: 'translateX(20px)',
  },
  cardIcon: {
    flexShrink: 0,
  },
  cardInfo: {
    flex: 1,
  },
  cardNumber: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  cardExpiry: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  moreBtn: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    color: '#666',
    cursor: 'pointer',
    padding: '4px',
  },
  addBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },
};

export default ManagePayments;


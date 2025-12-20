import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MdArrowBack, MdCreditCard, MdAccountBalance, MdPayment, MdRadioButtonUnchecked, MdRadioButtonChecked, MdQrCode2 } from 'react-icons/md';
import { FaChevronDown, FaChevronUp, FaGooglePay } from 'react-icons/fa';
import { SiPhonepe, SiPaytm } from 'react-icons/si';

const PaymentPage = () => {
  const navigate = useNavigate();
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [showCardForm, setShowCardForm] = useState(false);
  const [showUPIForm, setShowUPIForm] = useState(false);
  const [showPaymentApps, setShowPaymentApps] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [savedCards] = useState([
    { id: 1, last4: '5678', expiry: '10/25', type: 'visa' },
    { id: 2, last4: '1234', expiry: '08/26', type: 'mastercard' },
  ]);
  const [savedUPI] = useState([
    { id: 1, upiId: 'john@oksbi' },
  ]);

  // Card form state
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });

  // UPI form state
  const [upiId, setUpiId] = useState('');
  const [selectedUPIProvider, setSelectedUPIProvider] = useState('');

  // Payment apps with proper images
  const paymentApps = [
    {
      id: 'gpay',
      name: 'Google Pay',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png',
      upiId: 'merchant@paytm' // Example UPI ID
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/PhonePe_Logo.svg/512px-PhonePe_Logo.svg.png',
      upiId: 'merchant@ybl'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Paytm_Logo_%28standalone%29.svg/512px-Paytm_Logo_%28standalone%29.svg.png',
      upiId: 'merchant@paytm'
    },
    {
      id: 'amazonpay',
      name: 'Amazon Pay',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Amazon-Pay-Logo.svg/512px-Amazon-Pay-Logo.svg.png',
      upiId: 'merchant@apl'
    },
  ];

  const handlePaymentSelect = (type, data = {}) => {
    setSelectedPayment({ type, ...data });
    setShowCardForm(false);
    setShowUPIForm(false);
    setShowPaymentApps(false);

    if (type === 'card-new') {
      setShowCardForm(true);
    } else if (type === 'upi-new') {
      setShowUPIForm(true);
    } else if (type === 'payment-apps') {
      setShowPaymentApps(true);
    }
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      // Format card number with spaces
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      if (formattedValue.length > 19) return;
    } else if (name === 'cvv') {
      if (value.length > 3) return;
    } else if (name === 'expiryMonth' || name === 'expiryYear') {
      if (value.length > 2) return;
    }

    setCardData({ ...cardData, [name]: formattedValue });
  };

  const handleCardPayment = () => {
    // Validate card data
    if (!cardData.cardNumber || !cardData.cardName || !cardData.expiryMonth || !cardData.expiryYear || !cardData.cvv) {
      alert('Please fill all card details');
      return;
    }

    // Show OTP modal
    setShowOTPModal(true);
  };

  const handleOTPChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleVerifyOTP = () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      alert('Please enter complete OTP');
      return;
    }

    console.log('✅ OTP Verified:', otpValue);
    alert('Payment Successful! ✅');
    setShowOTPModal(false);
    localStorage.setItem('selectedPayment', JSON.stringify({ type: 'card-new', ...cardData }));
    navigate('/checkout/review');
  };

  const handleUPIPayment = () => {
    if (!upiId) {
      alert('Please enter UPI ID');
      return;
    }

    console.log('✅ UPI Payment:', upiId);
    alert('UPI Payment Request Sent! ✅');
    localStorage.setItem('selectedPayment', JSON.stringify({ type: 'upi-new', upiId }));
    navigate('/checkout/review');
  };

  const handlePaymentAppSelect = (app) => {
    console.log('✅ Payment App Selected:', app.name);

    // Get cart total from localStorage or use mock value
    const cartTotal = '49.90'; // In real app, get from cart context

    // Generate payment link based on app
    let paymentLink = '';

    switch(app.id) {
      case 'gpay':
        // Google Pay UPI link format
        paymentLink = `upi://pay?pa=${app.upiId}&pn=Woodzon&am=${cartTotal}&cu=USD&tn=Order Payment`;
        break;
      case 'phonepe':
        // PhonePe UPI link format
        paymentLink = `phonepe://pay?pa=${app.upiId}&pn=Woodzon&am=${cartTotal}&cu=USD&tn=Order Payment`;
        break;
      case 'paytm':
        // Paytm UPI link format
        paymentLink = `paytmmp://pay?pa=${app.upiId}&pn=Woodzon&am=${cartTotal}&cu=USD&tn=Order Payment`;
        break;
      case 'amazonpay':
        // Amazon Pay link (web-based)
        paymentLink = `https://www.amazon.com/gp/buy/spc/handlers/static-submit-decoupled.html`;
        break;
      default:
        paymentLink = `upi://pay?pa=${app.upiId}&pn=Woodzon&am=${cartTotal}&cu=USD&tn=Order Payment`;
    }

    // Try to open the payment app
    console.log('🔗 Payment Link:', paymentLink);

    // For mobile devices, try to open the app
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.location.href = paymentLink;

      // Fallback: If app doesn't open in 2 seconds, show message
      setTimeout(() => {
        alert(`Please install ${app.name} app or use another payment method.`);
      }, 2000);
    } else {
      // For desktop, show QR code or payment link
      alert(`Payment Link Generated!\n\nScan QR code or use ${app.name} app on your phone to complete payment.\n\nAmount: $${cartTotal}`);
    }

    // Save payment method and proceed
    localStorage.setItem('selectedPayment', JSON.stringify({
      type: 'payment-app',
      app: app.name,
      paymentLink: paymentLink
    }));

    // Simulate payment success after 3 seconds
    setTimeout(() => {
      console.log('✅ Payment successful via', app.name);
      navigate('/checkout/review');
    }, 3000);
  };

  const handleContinue = () => {
    if (!selectedPayment) {
      alert('Please select a payment method');
      return;
    }

    if (selectedPayment.type === 'card-new' && showCardForm) {
      handleCardPayment();
      return;
    }

    if (selectedPayment.type === 'upi-new' && showUPIForm) {
      handleUPIPayment();
      return;
    }

    localStorage.setItem('selectedPayment', JSON.stringify(selectedPayment));
    navigate('/checkout/review');
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/checkout/address')}>
            <MdArrowBack />
          </button>
          <h1 style={styles.headerTitle}>Payment</h1>
        </div>

        {/* Progress Indicator */}
        <div style={styles.progressContainer}>
          <div style={styles.progressStep}>
            <div style={{...styles.progressDot, ...styles.progressDotComplete}}>✓</div>
            <span style={{...styles.progressLabel, ...styles.progressLabelComplete}}>Address</span>
          </div>
          <div style={{...styles.progressLine, ...styles.progressLineComplete}}></div>
          <div style={{...styles.progressStep, ...styles.progressStepActive}}>
            <div style={{...styles.progressDot, ...styles.progressDotActive}}>2</div>
            <span style={{...styles.progressLabel, ...styles.progressLabelActive}}>Payment</span>
          </div>
          <div style={styles.progressLine}></div>
          <div style={styles.progressStep}>
            <div style={styles.progressDot}>3</div>
            <span style={styles.progressLabel}>Confirm</span>
          </div>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* View Order Summary */}
          <button
            style={styles.summaryToggle}
            onClick={() => setShowOrderSummary(!showOrderSummary)}
          >
            <span style={styles.summaryToggleText}>View Order Summary</span>
            {showOrderSummary ? <FaChevronUp /> : <FaChevronDown />}
          </button>

          {showOrderSummary && (
            <div style={styles.orderSummary}>
              <div style={styles.summaryRow}>
                <span>3 Items</span>
                <span>$42.50</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Shipping</span>
                <span>$5.00</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Tax</span>
                <span>$3.80</span>
              </div>
              <div style={{...styles.summaryRow, ...styles.summaryTotal}}>
                <span>Total</span>
                <span>$51.30</span>
              </div>
            </div>
          )}

          {/* Saved Payment Methods */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Saved Payment Methods</h2>
            
            {savedCards.map((card) => (
              <div
                key={card.id}
                style={{
                  ...styles.paymentCard,
                  ...(selectedPayment?.type === 'card' && selectedPayment?.id === card.id ? styles.paymentCardSelected : {})
                }}
                onClick={() => setSelectedPayment({ type: 'card', id: card.id, ...card })}
              >
                <div style={styles.paymentRadio}>
                  {selectedPayment?.type === 'card' && selectedPayment?.id === card.id ? (
                    <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                  ) : (
                    <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                  )}
                </div>
                <div style={styles.paymentIcon}>
                  <MdCreditCard style={{fontSize: '32px', color: '#666'}} />
                </div>
                <div style={styles.paymentInfo}>
                  <h3 style={styles.paymentTitle}>•••• •••• •••• {card.last4}</h3>
                  <p style={styles.paymentSubtitle}>Expires {card.expiry}</p>
                </div>
              </div>
            ))}

            {savedUPI.map((upi) => (
              <div
                key={upi.id}
                style={{
                  ...styles.paymentCard,
                  ...(selectedPayment?.type === 'upi' && selectedPayment?.id === upi.id ? styles.paymentCardSelected : {})
                }}
                onClick={() => setSelectedPayment({ type: 'upi', id: upi.id, ...upi })}
              >
                <div style={styles.paymentRadio}>
                  {selectedPayment?.type === 'upi' && selectedPayment?.id === upi.id ? (
                    <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                  ) : (
                    <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                  )}
                </div>
                <div style={styles.paymentIcon}>
                  <MdAccountBalance style={{fontSize: '32px', color: '#666'}} />
                </div>
                <div style={styles.paymentInfo}>
                  <h3 style={styles.paymentTitle}>•••• •••• •••• {upi.upiId.slice(-4)}</h3>
                  <p style={styles.paymentSubtitle}>UPI ID</p>
                </div>
              </div>
            ))}
          </div>

          {/* Other Payment Options */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Other Payment Options</h2>

            {/* Credit/Debit Card */}
            <div>
              <div
                style={{
                  ...styles.paymentCard,
                  ...(selectedPayment?.type === 'card-new' ? styles.paymentCardSelected : {})
                }}
                onClick={() => handlePaymentSelect('card-new')}
              >
                <div style={styles.paymentRadio}>
                  {selectedPayment?.type === 'card-new' ? (
                    <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                  ) : (
                    <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                  )}
                </div>
                <div style={styles.paymentIcon}>
                  <MdCreditCard style={{fontSize: '32px', color: '#666'}} />
                </div>
                <div style={styles.paymentInfo}>
                  <h3 style={styles.paymentTitle}>Credit / Debit Card</h3>
                </div>
              </div>

              {/* Card Form */}
              {showCardForm && (
                <div style={styles.formContainer}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardName"
                      placeholder="John Doe"
                      value={cardData.cardName}
                      onChange={handleCardInputChange}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Expiry Month</label>
                      <input
                        type="text"
                        name="expiryMonth"
                        placeholder="MM"
                        value={cardData.expiryMonth}
                        onChange={handleCardInputChange}
                        style={styles.inputSmall}
                        maxLength="2"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Expiry Year</label>
                      <input
                        type="text"
                        name="expiryYear"
                        placeholder="YY"
                        value={cardData.expiryYear}
                        onChange={handleCardInputChange}
                        style={styles.inputSmall}
                        maxLength="2"
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={handleCardInputChange}
                        style={styles.inputSmall}
                        maxLength="3"
                      />
                    </div>
                  </div>

                  <button style={styles.payBtn} onClick={handleCardPayment}>
                    Pay Now & Send OTP
                  </button>
                </div>
              )}
            </div>

            {/* UPI */}
            <div>
              <div
                style={{
                  ...styles.paymentCard,
                  ...(selectedPayment?.type === 'upi-new' ? styles.paymentCardSelected : {})
                }}
                onClick={() => handlePaymentSelect('upi-new')}
              >
                <div style={styles.paymentRadio}>
                  {selectedPayment?.type === 'upi-new' ? (
                    <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                  ) : (
                    <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                  )}
                </div>
                <div style={styles.paymentIcon}>
                  <MdAccountBalance style={{fontSize: '32px', color: '#666'}} />
                </div>
                <div style={styles.paymentInfo}>
                  <h3 style={styles.paymentTitle}>UPI</h3>
                </div>
              </div>

              {/* UPI Form */}
              {showUPIForm && (
                <div style={styles.formContainer}>
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Enter UPI ID</label>
                    <input
                      type="text"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.upiProviders}>
                    <p style={styles.providerLabel}>Quick Select:</p>
                    <div style={styles.providerButtons}>
                      {['@icici', '@kotak', '@paytm', '@ybl', '@oksbi', '@axl'].map((provider) => (
                        <button
                          key={provider}
                          style={styles.providerBtn}
                          onClick={() => {
                            const username = upiId.split('@')[0] || '';
                            setUpiId(username + provider);
                          }}
                        >
                          {provider}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button style={styles.payBtn} onClick={handleUPIPayment}>
                    Verify & Pay
                  </button>
                </div>
              )}
            </div>

            {/* Payment Apps */}
            <div>
              <div
                style={{
                  ...styles.paymentCard,
                  ...(selectedPayment?.type === 'payment-apps' ? styles.paymentCardSelected : {})
                }}
                onClick={() => handlePaymentSelect('payment-apps')}
              >
                <div style={styles.paymentRadio}>
                  {selectedPayment?.type === 'payment-apps' ? (
                    <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                  ) : (
                    <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                  )}
                </div>
                <div style={styles.paymentIcon}>
                  <MdQrCode2 style={{fontSize: '32px', color: '#666'}} />
                </div>
                <div style={styles.paymentInfo}>
                  <h3 style={styles.paymentTitle}>Payment Apps & QR Code</h3>
                </div>
              </div>

              {/* Payment Apps Grid */}
              {showPaymentApps && (
                <div style={styles.formContainer}>
                  <p style={styles.providerLabel}>Select Payment App:</p>
                  <div style={styles.paymentAppsGrid}>
                    {paymentApps.map((app) => (
                      <div
                        key={app.id}
                        style={styles.appCard}
                        onClick={() => handlePaymentAppSelect(app)}
                      >
                        <img
                          src={app.image}
                          alt={app.name}
                          style={styles.appImage}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <div style={{...styles.appIcon, display: 'none'}}>💳</div>
                        <div style={styles.appName}>{app.name}</div>
                      </div>
                    ))}
                  </div>

                  <div style={styles.qrSection}>
                    <p style={styles.qrLabel}>Or Scan QR Code:</p>
                    <div style={styles.qrCode}>
                      <MdQrCode2 style={{fontSize: '120px', color: '#333'}} />
                      <p style={styles.qrText}>Scan with any UPI app</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Cash on Delivery */}
            <div
              style={{
                ...styles.paymentCard,
                ...(selectedPayment?.type === 'cod' ? styles.paymentCardSelected : {})
              }}
              onClick={() => handlePaymentSelect('cod')}
            >
              <div style={styles.paymentRadio}>
                {selectedPayment?.type === 'cod' ? (
                  <MdRadioButtonChecked style={{fontSize: '24px', color: '#FF6B35'}} />
                ) : (
                  <MdRadioButtonUnchecked style={{fontSize: '24px', color: '#999'}} />
                )}
              </div>
              <div style={styles.paymentIcon}>
                <MdPayment style={{fontSize: '32px', color: '#666'}} />
              </div>
              <div style={styles.paymentInfo}>
                <h3 style={styles.paymentTitle}>Cash on Delivery</h3>
              </div>
            </div>
          </div>

          {/* Secure Payment Badge */}
          <div style={styles.securityBadge}>
            <span style={styles.securityIcon}>🔒</span>
            <span style={styles.securityText}>100% Secure Payments</span>
          </div>

          {/* Continue Button */}
          {!showCardForm && !showUPIForm && !showPaymentApps && (
            <button style={styles.continueBtn} onClick={handleContinue}>
              Proceed to Confirm
            </button>
          )}
        </div>
      </div>

      {/* OTP Modal */}
      {showOTPModal && (
        <div style={styles.modalOverlay} onClick={() => setShowOTPModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={styles.modalTitle}>Enter OTP</h2>
            <p style={styles.modalSubtitle}>We've sent a 6-digit OTP to your registered mobile number</p>

            <div style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleOTPChange(index, e.target.value)}
                  style={styles.otpInput}
                />
              ))}
            </div>

            <div style={styles.modalActions}>
              <button style={styles.verifyBtn} onClick={handleVerifyOTP}>
                Verify & Pay
              </button>
              <button style={styles.cancelBtn} onClick={() => setShowOTPModal(false)}>
                Cancel
              </button>
            </div>

            <p style={styles.resendText}>
              Didn't receive OTP? <span style={styles.resendLink}>Resend</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F5DC',
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
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px 20px',
    backgroundColor: 'white',
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  progressStepActive: {},
  progressDot: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#E0E0E0',
    color: '#999',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  progressDotActive: {
    backgroundColor: '#FF6B35',
    color: 'white',
  },
  progressDotComplete: {
    backgroundColor: '#4CAF50',
    color: 'white',
  },
  progressLabel: {
    fontSize: '12px',
    color: '#999',
    fontWeight: '500',
  },
  progressLabelActive: {
    color: '#FF6B35',
    fontWeight: '600',
  },
  progressLabelComplete: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  progressLine: {
    width: '60px',
    height: '2px',
    backgroundColor: '#E0E0E0',
    margin: '0 8px',
    marginBottom: '24px',
  },
  progressLineComplete: {
    backgroundColor: '#4CAF50',
  },
  content: {
    padding: '20px',
  },
  summaryToggle: {
    width: '100%',
    padding: '14px',
    backgroundColor: 'white',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    cursor: 'pointer',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  summaryToggleText: {},
  orderSummary: {
    padding: '16px',
    backgroundColor: '#F9F9F9',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: '#666',
  },
  summaryTotal: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#333',
    paddingTop: '12px',
    borderTop: '1px solid #E0E0E0',
    marginTop: '8px',
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
    gap: '12px',
    padding: '16px',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
    marginBottom: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'white',
  },
  paymentCardSelected: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F0',
  },
  paymentRadio: {
    flexShrink: 0,
  },
  paymentIcon: {
    flexShrink: 0,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  paymentSubtitle: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
  },
  securityBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '12px',
    backgroundColor: '#F0F8FF',
    borderRadius: '8px',
    marginBottom: '24px',
  },
  securityIcon: {
    fontSize: '20px',
  },
  securityText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1976D2',
  },
  continueBtn: {
    width: '100%',
    padding: '16px',
    backgroundColor: '#FF6B35',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  formContainer: {
    padding: '20px',
    backgroundColor: '#F9F9F9',
    borderRadius: '12px',
    marginTop: '12px',
    marginBottom: '12px',
  },
  formGroup: {
    marginBottom: '16px',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  inputSmall: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    textAlign: 'center',
  },
  payBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    marginTop: '8px',
  },
  upiProviders: {
    marginBottom: '16px',
  },
  providerLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '12px',
  },
  providerButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  providerBtn: {
    padding: '8px 16px',
    backgroundColor: 'white',
    border: '2px solid #E0E0E0',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  paymentAppsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
    marginBottom: '24px',
  },
  appCard: {
    padding: '20px',
    backgroundColor: 'white',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  appImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
    marginBottom: '12px',
  },
  appIcon: {
    fontSize: '48px',
    marginBottom: '8px',
  },
  appName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  qrSection: {
    textAlign: 'center',
    paddingTop: '24px',
    borderTop: '2px solid #E0E0E0',
  },
  qrLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '16px',
  },
  qrCode: {
    display: 'inline-block',
    padding: '24px',
    backgroundColor: 'white',
    border: '2px solid #E0E0E0',
    borderRadius: '12px',
  },
  qrText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '8px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '16px',
    maxWidth: '400px',
    width: '90%',
    textAlign: 'center',
  },
  modalTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#333',
    marginBottom: '8px',
  },
  modalSubtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '24px',
  },
  otpContainer: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '24px',
  },
  otpInput: {
    width: '48px',
    height: '56px',
    fontSize: '24px',
    fontWeight: '700',
    textAlign: 'center',
    border: '2px solid #E0E0E0',
    borderRadius: '8px',
    outline: 'none',
  },
  modalActions: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px',
  },
  verifyBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  cancelBtn: {
    flex: 1,
    padding: '14px',
    backgroundColor: '#F5F5F5',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
  },
  resendText: {
    fontSize: '14px',
    color: '#666',
  },
  resendLink: {
    color: '#FF6B35',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default PaymentPage;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportAPI, safeAPICall } from '../services/api';
import { mockFAQs, mockTickets, mockContactInfo } from '../data/mockSupport';
import { CONTACT_INFO } from '../components/Footer';

const HelpSupport = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [contactInfo, setContactInfo] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [faqResult, ticketResult, contactResult] = await Promise.all([
      safeAPICall(() => supportAPI.getFAQs(), mockFAQs, 'Fetch FAQs'),
      safeAPICall(() => supportAPI.getTickets({ limit: 3 }), mockTickets.slice(0, 3), 'Fetch Tickets'),
      safeAPICall(() => supportAPI.getContactInfo(), mockContactInfo, 'Fetch Contact Info'),
    ]);

    setFaqs(faqResult.data);
    setTickets(ticketResult.data);
    setContactInfo(contactResult.data);
    setLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const result = await safeAPICall(
      () => supportAPI.searchFAQs(searchQuery),
      mockFAQs.filter(faq =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      ),
      'Search FAQs'
    );

    setFaqs(result.data);
  };

  const toggleFAQ = (faqId) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const getStatusColor = (status) => {
    const colors = {
      open: '#4CAF50',
      pending: '#FFA726',
      resolved: '#66BB6A',
    };
    return colors[status] || '#999';
  };

  const getStatusBgColor = (status) => {
    const colors = {
      open: '#E8F5E9',
      pending: '#FFF3E0',
      resolved: '#E8F5E9',
    };
    return colors[status] || '#F5F5F5';
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 style={styles.pageTitle}>Help & Support</h1>
          <div style={{ width: '40px' }} />
        </div>

        <div style={styles.searchSection}>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchBar}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                placeholder="Search for help..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
            </div>
          </form>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
          <div style={styles.faqList}>
            {faqs.map((faq) => (
              <div key={faq.id} style={styles.faqItem}>
                <button
                  style={styles.faqQuestion}
                  onClick={() => toggleFAQ(faq.id)}
                >
                  <span style={styles.faqQuestionText}>{faq.question}</span>
                  <span style={styles.faqIcon}>
                    {expandedFAQ === faq.id ? '▲' : '▼'}
                  </span>
                </button>
                {expandedFAQ === faq.id && (
                  <div style={styles.faqAnswer}>
                    <p style={styles.faqAnswerText}>{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Get in Touch</h2>
          <div style={styles.contactOptions}>
            <div style={styles.contactCard} onClick={() => navigate('/support/chat')}>
              <div style={styles.contactIcon}>💬</div>
              <div style={styles.contactContent}>
                <h3 style={styles.contactTitle}>Live Chat</h3>
                <p style={styles.contactSubtitle}>{contactInfo?.liveChat?.availability}</p>
              </div>
              <span style={styles.contactArrow}>›</span>
            </div>

            <div
              style={styles.contactCard}
              onClick={() => {
                const footer = document.getElementById('footer-contact');
                if (footer) {
                  footer.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <div style={styles.contactIcon}>📞</div>
              <div style={styles.contactContent}>
                <h3 style={styles.contactTitle}>Call Support</h3>
                <p style={styles.contactSubtitle}>{contactInfo?.phone?.available}</p>
              </div>
              <span style={styles.contactArrow}>›</span>
            </div>

            <div
              style={styles.contactCard}
              onClick={() => window.location.href = `mailto:${CONTACT_INFO.email}`}
            >
              <div style={styles.contactIcon}>✉️</div>
              <div style={styles.contactContent}>
                <h3 style={styles.contactTitle}>Email Us</h3>
                <p style={styles.contactSubtitle}>{contactInfo?.email?.responseTime}</p>
              </div>
              <span style={styles.contactArrow}>›</span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <div style={styles.ticketsHeader}>
            <h2 style={styles.sectionTitle}>Recent Tickets</h2>
            <button
              style={styles.viewAllBtn}
              onClick={() => navigate('/support/tickets')}
            >
              View All
            </button>
          </div>

          {tickets.length === 0 ? (
            <div style={styles.emptyTickets}>
              <p style={styles.emptyText}>No support tickets yet</p>
              <button
                style={styles.createTicketBtn}
                onClick={() => navigate('/support/tickets/new')}
              >
                Create New Ticket
              </button>
            </div>
          ) : (
            <div style={styles.ticketsList}>
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  style={styles.ticketCard}
                  onClick={() => navigate(`/support/tickets/${ticket.id}`)}
                >
                  <div style={styles.ticketHeader}>
                    <h3 style={styles.ticketSubject}>{ticket.subject}</h3>
                    <span
                      style={{
                        ...styles.ticketStatus,
                        backgroundColor: getStatusBgColor(ticket.status),
                        color: getStatusColor(ticket.status),
                      }}
                    >
                      {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                    </span>
                  </div>
                  <p style={styles.ticketId}>Ticket ID: {ticket.ticketNumber}</p>
                  <span style={styles.ticketArrow}>›</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F0E8',
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
    justifyContent: 'space-between',
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
    fontSize: '35px',
    cursor: 'pointer',
    padding: '8px',
    color: '#333',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  searchSection: {
    padding: '20px',
    borderBottom: '1px solid #F0F0F0',
  },
  searchForm: {
    width: '100%',
  },
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#F5F5F5',
    borderRadius: '12px',
    padding: '12px 16px',
    border: '1px solid #E0E0E0',
  },
  searchIcon: {
    fontSize: '20px',
  },
  searchInput: {
    flex: 1,
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    fontSize: '15px',
    color: '#333',
  },
  section: {
    padding: '20px',
    borderBottom: '1px solid #F0F0F0',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 16px 0',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  faqItem: {
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  faqQuestion: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  faqQuestionText: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  faqIcon: {
    fontSize: '12px',
    color: '#666',
  },
  faqAnswer: {
    padding: '0 16px 16px',
    backgroundColor: '#FAFAFA',
  },
  faqAnswerText: {
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
    margin: 0,
  },
  contactOptions: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  contactCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px',
    backgroundColor: '#FAFAFA',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '1px solid #E0E0E0',
    transition: 'all 0.2s',
  },
  contactIcon: {
    fontSize: '28px',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: '50%',
  },
  contactContent: {
    flex: 1,
  },
  contactTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  contactSubtitle: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  contactArrow: {
    fontSize: '24px',
    color: '#999',
  },
  ticketsHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  viewAllBtn: {
    background: 'none',
    border: 'none',
    color: '#FF6B35',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
  },
  ticketsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  ticketCard: {
    position: 'relative',
    padding: '16px',
    backgroundColor: '#FAFAFA',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '1px solid #E0E0E0',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px',
  },
  ticketSubject: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    flex: 1,
    paddingRight: '8px',
  },
  ticketStatus: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  ticketId: {
    fontSize: '13px',
    color: '#666',
    margin: 0,
  },
  ticketArrow: {
    position: 'absolute',
    right: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '24px',
    color: '#999',
  },
  emptyTickets: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '16px',
  },
  createTicketBtn: {
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    color: '#666',
  },
};

export default HelpSupport;

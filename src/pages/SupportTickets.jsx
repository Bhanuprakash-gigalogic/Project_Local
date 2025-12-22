import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportAPI, safeAPICall } from '../services/api';
import { mockTickets } from '../data/mockSupport';

const SupportTickets = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, open, pending, resolved

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    setLoading(true);
    const params = filter !== 'all' ? { status: filter } : {};
    
    const result = await safeAPICall(
      () => supportAPI.getTickets(params),
      filter !== 'all' 
        ? mockTickets.filter(t => t.status === filter)
        : mockTickets,
      'Fetch Tickets'
    );
    
    setTickets(result.data);
    setLoading(false);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading tickets...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 style={styles.pageTitle}>Support Tickets</h1>
          <button
            style={styles.newTicketBtn}
            onClick={() => navigate('/support/tickets/new')}
          >
            +
          </button>
        </div>

        {/* Filter Tabs */}
        <div style={styles.filterTabs}>
          {['all', 'open', 'pending', 'resolved'].map((status) => (
            <button
              key={status}
              style={{
                ...styles.filterTab,
                ...(filter === status ? styles.filterTabActive : {}),
              }}
              onClick={() => setFilter(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        {tickets.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>🎫</div>
            <h3 style={styles.emptyTitle}>No tickets found</h3>
            <p style={styles.emptyMessage}>
              {filter === 'all'
                ? 'You haven\'t created any support tickets yet'
                : `No ${filter} tickets`}
            </p>
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
                  <div style={styles.ticketInfo}>
                    <h3 style={styles.ticketSubject}>{ticket.subject}</h3>
                    <p style={styles.ticketId}>Ticket ID: {ticket.ticketNumber}</p>
                    <p style={styles.ticketDate}>Created: {formatDate(ticket.createdAt)}</p>
                  </div>
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
                <p style={styles.ticketDescription}>{ticket.description}</p>
                <div style={styles.ticketFooter}>
                  <span style={styles.ticketCategory}>📁 {ticket.category}</span>
                  <span style={styles.ticketArrow}>›</span>
                </div>
              </div>
            ))}
          </div>
        )}
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
    fontSize: '24px',
    cursor: 'pointer',
    padding: '8px',
    color: '#333',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
    flex: 1,
    textAlign: 'center',
  },
  newTicketBtn: {
    background: '#8B4513',
    color: 'white',
    border: 'none',
    fontSize: '24px',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterTabs: {
    display: 'flex',
    borderBottom: '1px solid #E0E0E0',
    backgroundColor: 'white',
    position: 'sticky',
    top: '73px',
    zIndex: 9,
  },
  filterTab: {
    flex: 1,
    padding: '12px',
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    fontSize: '14px',
    fontWeight: '500',
    color: '#666',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterTabActive: {
    color: '#8B4513',
    borderBottomColor: '#8B4513',
  },
  ticketsList: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  ticketCard: {
    padding: '16px',
    backgroundColor: '#FAFAFA',
    borderRadius: '12px',
    cursor: 'pointer',
    border: '1px solid #E0E0E0',
    transition: 'all 0.2s',
  },
  ticketHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  ticketInfo: {
    flex: 1,
  },
  ticketSubject: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  ticketId: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 2px 0',
  },
  ticketDate: {
    fontSize: '12px',
    color: '#999',
    margin: 0,
  },
  ticketStatus: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '12px',
    flexShrink: 0,
  },
  ticketDescription: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px 0',
    lineHeight: '1.4',
  },
  ticketFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ticketCategory: {
    fontSize: '13px',
    color: '#666',
  },
  ticketArrow: {
    fontSize: '24px',
    color: '#999',
  },
  emptyState: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  emptyIcon: {
    fontSize: '64px',
    marginBottom: '16px',
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 8px 0',
  },
  emptyMessage: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 24px 0',
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

export default SupportTickets;


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { supportAPI, safeAPICall } from '../services/api';
import { mockTickets } from '../data/mockSupport';

const TicketDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchTicket();
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    const result = await safeAPICall(
      () => supportAPI.getTicketById(id),
      mockTickets.find(t => t.id === id),
      'Fetch Ticket Detail'
    );
    
    setTicket(result.data);
    setLoading(false);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setSending(true);
    await safeAPICall(
      () => supportAPI.addTicketMessage(id, { message: newMessage }),
      { success: true },
      'Send Message'
    );

    // Add message to local state
    const newMsg = {
      id: `msg_${Date.now()}`,
      sender: 'customer',
      message: newMessage,
      timestamp: new Date().toISOString(),
      attachments: [],
    };

    setTicket({
      ...ticket,
      messages: [...ticket.messages, newMsg],
    });

    setNewMessage('');
    setSending(false);
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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.loading}>Loading ticket...</div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.error}>Ticket not found</div>
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
          <div style={styles.headerContent}>
            <h1 style={styles.pageTitle}>Ticket #{ticket.ticketNumber}</h1>
            <span
              style={{
                ...styles.status,
                backgroundColor: getStatusBgColor(ticket.status),
                color: getStatusColor(ticket.status),
              }}
            >
              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Ticket Info */}
        <div style={styles.ticketInfo}>
          <h2 style={styles.subject}>{ticket.subject}</h2>
          <div style={styles.meta}>
            <span style={styles.metaItem}>📁 {ticket.category}</span>
            <span style={styles.metaItem}>
              🕒 {new Date(ticket.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div style={styles.messagesContainer}>
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.message,
                ...(message.sender === 'customer' ? styles.messageCustomer : styles.messageSupport),
              }}
            >
              <div style={styles.messageHeader}>
                <span style={styles.messageSender}>
                  {message.sender === 'customer' ? 'You' : message.senderName || 'Support Team'}
                </span>
                <span style={styles.messageTime}>{formatTimestamp(message.timestamp)}</span>
              </div>
              <p style={styles.messageText}>{message.message}</p>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        {ticket.status !== 'resolved' && (
          <form style={styles.replyForm} onSubmit={handleSendMessage}>
            <textarea
              style={styles.replyInput}
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              rows={3}
            />
            <button
              type="submit"
              style={styles.sendBtn}
              disabled={sending || !newMessage.trim()}
            >
              {sending ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}

        {ticket.status === 'resolved' && (
          <div style={styles.resolvedNotice}>
            <p style={styles.resolvedText}>✅ This ticket has been resolved</p>
            <button
              style={styles.reopenBtn}
              onClick={async () => {
                await safeAPICall(
                  () => supportAPI.reopenTicket(id),
                  { success: true },
                  'Reopen Ticket'
                );
                setTicket({ ...ticket, status: 'open' });
              }}
            >
              Reopen Ticket
            </button>
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
    gap: '12px',
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
  headerContent: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pageTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#333',
    margin: 0,
  },
  status: {
    fontSize: '12px',
    fontWeight: '500',
    padding: '4px 12px',
    borderRadius: '12px',
  },
  ticketInfo: {
    padding: '20px',
    borderBottom: '1px solid #F0F0F0',
  },
  subject: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 12px 0',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '13px',
    color: '#666',
  },
  messagesContainer: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    minHeight: '300px',
  },
  message: {
    padding: '12px 16px',
    borderRadius: '12px',
    maxWidth: '85%',
  },
  messageCustomer: {
    backgroundColor: '#E3F2FD',
    alignSelf: 'flex-end',
  },
  messageSupport: {
    backgroundColor: '#F5F5F5',
    alignSelf: 'flex-start',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  messageSender: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#333',
  },
  messageTime: {
    fontSize: '11px',
    color: '#999',
  },
  messageText: {
    fontSize: '14px',
    color: '#333',
    margin: 0,
    lineHeight: '1.4',
  },
  replyForm: {
    padding: '20px',
    borderTop: '1px solid #E0E0E0',
    backgroundColor: 'white',
    position: 'sticky',
    bottom: 0,
  },
  replyInput: {
    width: '100%',
    padding: '12px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    marginBottom: '12px',
    outline: 'none',
  },
  sendBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  resolvedNotice: {
    padding: '20px',
    borderTop: '1px solid #E0E0E0',
    backgroundColor: '#F9FFF9',
    textAlign: 'center',
  },
  resolvedText: {
    fontSize: '14px',
    color: '#4CAF50',
    fontWeight: '500',
    margin: '0 0 12px 0',
  },
  reopenBtn: {
    padding: '10px 20px',
    backgroundColor: 'white',
    color: '#8B4513',
    border: '1px solid #8B4513',
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
  error: {
    textAlign: 'center',
    padding: '60px 20px',
    fontSize: '16px',
    color: '#C7511F',
  },
};

export default TicketDetail;


import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LiveChat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'agent',
      text: 'Hello! Welcome to Woodzon Support. How can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date(),
    };
    setMessages([...messages, userMessage]);
    setInputMessage('');

    // Simulate agent typing
    setIsTyping(true);
    setTimeout(() => {
      const agentMessage = {
        id: messages.length + 2,
        sender: 'agent',
        text: 'Thank you for your message. Our support team will assist you shortly.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ←
          </button>
          <div style={styles.headerInfo}>
            <h1 style={styles.pageTitle}>Live Chat</h1>
            <p style={styles.status}>
              <span style={styles.statusDot}></span>
              Online
            </p>
          </div>
          <div style={{ width: '40px' }} />
        </div>

        {/* Messages */}
        <div style={styles.messagesContainer}>
          {messages.map((message) => (
            <div
              key={message.id}
              style={{
                ...styles.messageWrapper,
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <div
                style={{
                  ...styles.messageBubble,
                  backgroundColor: message.sender === 'user' ? '#8B4513' : '#F0F0F0',
                  color: message.sender === 'user' ? '#FFFFFF' : '#333',
                }}
              >
                <p style={styles.messageText}>{message.text}</p>
                <span style={{
                  ...styles.messageTime,
                  color: message.sender === 'user' ? '#FFFFFF99' : '#66666699',
                }}>
                  {formatTime(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div style={styles.messageWrapper}>
              <div style={{ ...styles.messageBubble, backgroundColor: '#F0F0F0' }}>
                <p style={styles.typingText}>Agent is typing...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form style={styles.inputContainer} onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.sendBtn} disabled={!inputMessage.trim()}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  page: {
    backgroundColor: '#F5F0E8',
    minHeight: '100vh',
    paddingBottom: '0',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: 'white',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 20px',
    borderBottom: '1px solid #E0E0E0',
    backgroundColor: 'white',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '35px',
    cursor: 'pointer',
    padding: '8px',
    color: '#333',
  },
  headerInfo: {
    flex: 1,
    textAlign: 'center',
  },
  pageTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#333',
    margin: '0 0 4px 0',
  },
  status: {
    fontSize: '13px',
    color: '#4CAF50',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  messageWrapper: {
    display: 'flex',
    width: '100%',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  messageText: {
    fontSize: '15px',
    margin: 0,
    lineHeight: '1.4',
  },
  messageTime: {
    fontSize: '11px',
    alignSelf: 'flex-end',
  },
  typingText: {
    fontSize: '14px',
    color: '#666',
    margin: 0,
    fontStyle: 'italic',
  },
  inputContainer: {
    display: 'flex',
    gap: '12px',
    padding: '16px 20px',
    borderTop: '1px solid #E0E0E0',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '1px solid #E0E0E0',
    borderRadius: '24px',
    fontSize: '15px',
    outline: 'none',
  },
  sendBtn: {
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '24px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
  },
};

export default LiveChat;


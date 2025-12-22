import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supportAPI, safeAPICall } from '../services/api';

const CreateTicket = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    description: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);

  const categories = [
    'Product Issue',
    'Delivery',
    'Refund',
    'Payment',
    'Account',
    'Technical',
    'Other',
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.subject || !formData.category || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    
    const result = await safeAPICall(
      () => supportAPI.createTicket(formData),
      { 
        success: true, 
        ticket: {
          id: `ticket_${Date.now()}`,
          ticketNumber: Math.random().toString(36).substring(2, 8).toUpperCase(),
          ...formData,
          status: 'open',
          createdAt: new Date().toISOString(),
        }
      },
      'Create Ticket'
    );

    setSubmitting(false);

    if (result.success) {
      alert('Ticket created successfully!');
      navigate('/support/tickets');
    } else {
      alert('Failed to create ticket. Please try again.');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            ←
          </button>
          <h1 style={styles.pageTitle}>Create Support Ticket</h1>
          <div style={{ width: '40px' }} /> {/* Spacer */}
        </div>

        {/* Form */}
        <form style={styles.form} onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              Subject <span style={styles.required}>*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Brief description of your issue"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Category <span style={styles.required}>*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              style={styles.select}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Priority</label>
            <div style={styles.radioGroup}>
              {['low', 'medium', 'high'].map((priority) => (
                <label key={priority} style={styles.radioLabel}>
                  <input
                    type="radio"
                    name="priority"
                    value={priority}
                    checked={formData.priority === priority}
                    onChange={handleChange}
                    style={styles.radio}
                  />
                  <span style={styles.radioText}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              Description <span style={styles.required}>*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Please provide detailed information about your issue..."
              style={styles.textarea}
              rows={6}
              required
            />
          </div>

          <button
            type="submit"
            style={styles.submitBtn}
            disabled={submitting}
          >
            {submitting ? 'Creating Ticket...' : 'Create Ticket'}
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
  },
  form: {
    padding: '20px',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px',
  },
  required: {
    color: '#FF6B35',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '14px',
    outline: 'none',
    backgroundColor: 'white',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid #E0E0E0',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    resize: 'vertical',
    outline: 'none',
  },
  radioGroup: {
    display: 'flex',
    gap: '16px',
  },
  radioLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  radio: {
    cursor: 'pointer',
  },
  radioText: {
    fontSize: '14px',
    color: '#333',
  },
  submitBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#8B4513',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
  },
};

export default CreateTicket;


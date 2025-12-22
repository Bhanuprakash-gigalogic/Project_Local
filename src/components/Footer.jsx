import { Link } from 'react-router-dom';
import { MdPhone, MdEmail, MdLocationOn } from 'react-icons/md';

// Centralized contact information
export const CONTACT_INFO = {
  landline: '1-800-WOODZON',
  landlineTel: '+18009663966',
  mobile: '+1 (555) 123-4567',
  mobileTel: '+15551234567',
  email: 'support@woodzon.com',
  address: '123 Furniture Street, Design City, DC 12345',
};

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer-contact" style={styles.footer}>
      <div style={styles.container}>
        {/* Contact Information Section */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Contact Us</h3>
          <div style={styles.contactList}>
            <div style={styles.contactItem}>
              <MdPhone style={styles.contactIcon} />
              <div>
                <p style={styles.contactLabel}>Landline</p>
                <a href={`tel:${CONTACT_INFO.landlineTel}`} style={styles.contactLink}>
                  {CONTACT_INFO.landline}
                </a>
              </div>
            </div>
            <div style={styles.contactItem}>
              <MdPhone style={styles.contactIcon} />
              <div>
                <p style={styles.contactLabel}>Mobile</p>
                <a href={`tel:${CONTACT_INFO.mobileTel}`} style={styles.contactLink}>
                  {CONTACT_INFO.mobile}
                </a>
              </div>
            </div>
            <div style={styles.contactItem}>
              <MdEmail style={styles.contactIcon} />
              <div>
                <p style={styles.contactLabel}>Email</p>
                <a href={`mailto:${CONTACT_INFO.email}`} style={styles.contactLink}>
                  {CONTACT_INFO.email}
                </a>
              </div>
            </div>
            <div style={styles.contactItem}>
              <MdLocationOn style={styles.contactIcon} />
              <div>
                <p style={styles.contactLabel}>Address</p>
                <p style={styles.contactText}>{CONTACT_INFO.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Quick Links</h3>
          <div style={styles.linkList}>
            <Link to="/support" style={styles.link}>Help & Support</Link>
            <Link to="/support/tickets" style={styles.link}>My Tickets</Link>
            <Link to="/orders" style={styles.link}>My Orders</Link>
            <Link to="/wishlist" style={styles.link}>Wishlist</Link>
          </div>
        </div>

        {/* About */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>About Woodzon</h3>
          <p style={styles.aboutText}>
            Your trusted destination for quality furniture and home decor. 
            We bring comfort and style to your living spaces.
          </p>
        </div>
      </div>

      {/* Copyright */}
      <div style={styles.copyright}>
        <p style={styles.copyrightText}>
          © 2024 Woodzon. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2C2C2C',
    color: '#FFFFFF',
    padding: '40px 20px 20px',
    marginTop: '60px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    marginBottom: '30px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: '8px',
  },
  contactList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
  },
  contactIcon: {
    fontSize: '24px',
    color: '#FF6B35',
    marginTop: '2px',
  },
  contactLabel: {
    fontSize: '12px',
    color: '#999',
    margin: '0 0 4px 0',
  },
  contactLink: {
    fontSize: '15px',
    color: '#FFFFFF',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  contactText: {
    fontSize: '14px',
    color: '#CCCCCC',
    margin: 0,
    lineHeight: '1.5',
  },
  linkList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    fontSize: '14px',
    color: '#CCCCCC',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  aboutText: {
    fontSize: '14px',
    color: '#CCCCCC',
    lineHeight: '1.6',
    margin: 0,
  },
  copyright: {
    borderTop: '1px solid #444',
    paddingTop: '20px',
    textAlign: 'center',
  },
  copyrightText: {
    fontSize: '13px',
    color: '#999',
    margin: 0,
  },
};

export default Footer;


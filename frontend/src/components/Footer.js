import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.brandSection}>
          <h3 style={styles.brandTitle}>🍹 Fresh Juice Bar</h3>
          <p style={styles.text}>100% natural, refreshing fruit juices crafted fresh daily.</p>
        </div>

        <div style={styles.infoSection}>
          <p style={styles.item}>
            📍 <strong>Address:</strong> No 34, Dehiwaththa Road, Kelaniya
          </p>
          <p style={styles.item}>
            📞 <strong>Contact Us:</strong> 076 937 0158
          </p>
          <p style={styles.item}>
            ⏰ <strong>Opening Hours:</strong> Daily 8:00 AM – 9:00 PM
          </p>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <p style={styles.copyText}>
          © {new Date().getFullYear()} Fresh Juice Bar. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#2d3748',
    color: '#edf2f7',
    marginTop: '60px',
    paddingTop: '30px',
    borderTop: '4px solid #ff6b35',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 20px 20px',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: '20px',
  },
  brandSection: {
    flex: '1 1 280px',
  },
  brandTitle: {
    color: '#ff6b35',
    fontSize: '20px',
    marginBottom: '8px',
  },
  text: {
    color: '#a0aec0',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  infoSection: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  item: {
    fontSize: '14px',
    color: '#cbd5e0',
    margin: 0,
  },
  bottomBar: {
    borderTop: '1px solid #4a5568',
    textAlign: 'center',
    padding: '12px 20px',
    backgroundColor: '#1a202c',
  },
  copyText: {
    margin: 0,
    fontSize: '12px',
    color: '#a0aec0',
  },
};

export default Footer;
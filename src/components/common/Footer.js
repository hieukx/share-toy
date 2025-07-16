import React from 'react';

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.text}>
        ©2025 HKX-ShareToys. Kết nối yêu thương qua từng món đồ chơi.<br />
        Liên hệ: <a href="mailto:info@sharetoys.vn" style={styles.link}>sharetoys.vn</a>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1976d2',
    color: '#fff',
    textAlign: 'center',
    padding: '24px 0 16px 0',
    marginTop: 48,
    fontSize: '1.1rem',
  },
  text: {
    lineHeight: 1.7,
  },
  link: {
    color: '#fff',
    textDecoration: 'underline',
  },
};

export default Footer; 
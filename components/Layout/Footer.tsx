import { THEME_COLOR } from '@/constants/color';
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <p>
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: THEME_COLOR.headerBg,
    color: THEME_COLOR.text,
    textAlign: 'center' as const,
    padding: '1rem 0',
    marginTop: 'auto',
    minHeight: '56px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
  },
};

export default Footer;

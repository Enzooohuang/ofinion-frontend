import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: '#f0f0f0',
        padding: '1rem',
        borderTop: '1px solid #ccc',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
        <Link
          to='/terms' // Changed Trademark to Disclaimer
          style={{
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          Terms
        </Link>
        <Link
          to='/Privacy'
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Privacy
        </Link>
      </div>
      <p style={{ marginTop: '1rem' }}>
        &copy; 2024 oFinion App. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

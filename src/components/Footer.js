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
          to='/about'
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          About
        </Link>
        <Link
          to='/pricing' // Changed Privacy to Pricing
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Pricing
        </Link>
        {/* Removed the line below */}
        <Link
          to='/disclaimer' // Changed Trademark to Disclaimer
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Disclaimer
        </Link>
        {/* Removed the line below */}
        <Link
          to='/contact'
          style={{ color: 'inherit', textDecoration: 'none' }}
        >
          Contact
        </Link>
      </div>
      <p style={{ marginTop: '1rem' }}>
        &copy; 2023 Stock Analysis App. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;

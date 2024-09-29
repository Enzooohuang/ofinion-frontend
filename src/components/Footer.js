import React from 'react';
import footerImage from '../assets/Footer.png'; // Make sure Footer.png is in the src/assets folder

function Footer() {
  return (
    <footer className='footer'>
      <img
        src={footerImage}
        alt='Footer'
        className='footer-image'
      />
    </footer>
  );
}

export default Footer;

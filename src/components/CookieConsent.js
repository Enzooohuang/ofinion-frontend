import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './css/CookieConsent.css'; // We'll create this CSS file

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const cookieConsent = Cookies.get('cookie_consent');
    if (!cookieConsent) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    Cookies.set('cookie_consent', 'true', { expires: 365 });
    setShowBanner(false);
  };

  const declineCookies = () => {
    Cookies.set('cookie_consent', 'false', { expires: 365 });
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className='cookie-consent-banner'>
      <div className='cookie-consent-content'>
        <p>
          We use cookies to improve your experience. By using our website, you
          consent to our use of cookies.
        </p>
        <div className='cookie-consent-buttons'>
          <button
            className='cookie-consent-button accept'
            onClick={acceptCookies}
          >
            Accept
          </button>
          <button
            className='cookie-consent-button decline'
            onClick={declineCookies}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

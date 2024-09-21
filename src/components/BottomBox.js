import React, { useState } from 'react';
import './css/BottomBox.css';

function BottomBox() {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);

  const isValidEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async () => {
    if (!firstName || !email) {
      // Do nothing if either field is empty
      return;
    }

    if (!isValidEmail(email)) {
      setEmailError(true);
      return;
    }

    setEmailError(false);

    try {
      // Your API call logic here
      console.log('Submitting:', { firstName, email });
      setFirstName('');
      setEmail('');
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <div className='bottom-box'>
      <div className='bottom-box-left'>
        <h2>Get notified when we launch more exciting features for you</h2>
      </div>
      <div className='bottom-box-right'>
        <input
          type='text'
          placeholder='First Name'
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <div className='email-input-container'>
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(false);
            }}
            className={emailError ? 'error' : ''}
          />
          <button
            className='submit-button'
            onClick={handleSubmit}
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  );
}

export default BottomBox;

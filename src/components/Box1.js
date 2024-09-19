import React from 'react';

const Box1 = () => {
  return (
    <div
      className='box'
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          color: '#7B61FF',
          fontSize: '45px',
          marginBottom: '15px',
          fontWeight: 'bold',
        }}
      >
        AI-Empowered Earnings Copilot
      </h1>
      <p
        style={{
          color: 'darkgray',
          fontSize: '20px',
          maxWidth: '80%',
          lineHeight: '1.5',
        }}
      >
        built by former Wall St. equity research analyst, for everyone who
        invest
      </p>
      <p
        style={{
          color: 'black',
          fontSize: '24px',
          maxWidth: '80%',
          lineHeight: '1.5',
        }}
      >
        We tailor advanced AI technologies to earnings to create the smartest
        tool helping you{' '}
        <b>digest company earnings / financial results easier than ever</b>
      </p>
    </div>
  );
};

export default Box1;

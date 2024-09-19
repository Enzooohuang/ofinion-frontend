import React from 'react';
import displayImg from '../assets/displayimg.png'; // Make sure this path is correct

const DisplayImage = () => {
  return (
    <div
      className='box'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      <img
        src={displayImg}
        alt='two people sharing information'
        style={{
          maxWidth: '80%',
          maxHeight: '400px',
          objectFit: 'contain',
        }}
      />
    </div>
  );
};

export default DisplayImage;

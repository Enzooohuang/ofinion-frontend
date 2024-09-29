import React from 'react';
import screenshot from '../assets/screenshot.png'; // Adjust the path as needed

const Box6 = () => {
  return (
    <div
      className='box'
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '10px',
      }}
    >
      <img
        src={screenshot}
        alt='Screenshot'
        style={{
          width: '80%',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
};

export default Box6;

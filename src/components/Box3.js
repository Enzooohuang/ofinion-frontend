import React from 'react';
import EarningsEventsList from './EarningsEventsList';

const Box3 = ({ axiosInstance, baseUrl }) => {
  return (
    <div
      className='box'
      style={{ padding: '20px' }}
    >
      <EarningsEventsList
        axiosInstance={axiosInstance}
        baseUrl={baseUrl}
      />
    </div>
  );
};

export default Box3;

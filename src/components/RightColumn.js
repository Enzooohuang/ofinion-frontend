import React from 'react';
import './css/RightColumn.css';

const RightColumn = ({
  transcriptData,
  company_symbol,
  year,
  quarter,
  name,
  conferenceDate,
  exchange,
  axiosInstance,
}) => {
  return (
    <div className='right-column'>
      <h2>{name}</h2>
      <span>
        {year} Q{quarter}
      </span>
    </div>
  );
};

export default RightColumn;

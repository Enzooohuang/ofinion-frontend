import React, { useState } from 'react';
import './css/LeftColumn.css';
import AIConversation from './AIConversation';

const ChevronIcon = ({ isOpen }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
    className={`chevron-icon ${isOpen ? 'open' : ''}`}
  >
    <polyline points='6 9 12 15 18 9'></polyline>
  </svg>
);

const LeftColumn = ({
  transcriptData,
  company_symbol,
  year,
  quarter,
  name,
  conferenceDate,
  exchange,
  axiosInstance,
}) => {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const togglePanel = () => {
    setIsTranscriptOpen(!isTranscriptOpen);
  };

  return (
    <div className='left-column'>
      <div className='top-component'>
        <div className={`panel transcripts ${isTranscriptOpen ? 'open' : ''}`}>
          <h3 onClick={() => togglePanel()}>
            Opened Transcripts
            <ChevronIcon isOpen={isTranscriptOpen} />
          </h3>
          <div className='panel-content'>
            {/* Add content for Opened Transcripts here */}
          </div>
        </div>
        <div className={`panel searches ${!isTranscriptOpen ? 'open' : ''}`}>
          <h3 onClick={() => togglePanel()}>
            Smart Searches
            <ChevronIcon isOpen={!isTranscriptOpen} />
          </h3>
          <div className='panel-content'>
            {/* Add content for Popular & Historical Smart Searches here */}
          </div>
        </div>
      </div>
      <div className='bottom-component'>
        <AIConversation
          transcript={transcriptData}
          company_symbol={company_symbol}
          year={year}
          quarter={quarter}
          name={name}
          conferenceDate={conferenceDate}
          exchange={exchange}
          axiosInstance={axiosInstance}
        />
      </div>
    </div>
  );
};

export default LeftColumn;

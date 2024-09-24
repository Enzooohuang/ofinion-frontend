import React, { useState } from 'react';
import './css/LeftColumn.css';
import AIConversation from './AIConversation';

export const ChevronIcon = ({ isOpen }) => (
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

const CircleCheckbox = ({ checked, onChange, isDisabled }) => (
  <div
    className={`circle-checkbox ${checked ? 'checked' : ''} ${
      isDisabled ? 'disabled' : ''
    }`}
    onClick={onChange}
  >
    {checked && <div className='inner-circle'></div>}
  </div>
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
  setReference,
  searchHistory,
  setSearchHistory,
  shouldShowSentiment,
  setShouldShowSentiment,
}) => {
  const [isTranscriptOpen, setIsTranscriptOpen] = useState(false);

  const togglePanel = () => {
    setIsTranscriptOpen(!isTranscriptOpen);
  };

  const handleSentimentChange = (type) => {
    setShouldShowSentiment(!shouldShowSentiment);
  };

  const handleSearchChange = (query) => {
    const tempHistory = searchHistory.map((search) => {
      if (search.search_query !== query) {
        return { ...search, show: false };
      }
      return { ...search, show: !search.show };
    });
    setSearchHistory(tempHistory);
  };

  const handleRemoveSearch = (query, event) => {
    event.stopPropagation(); // Prevent triggering the onClick of the parent li
    const tempHistory = searchHistory.filter(
      (search) => search.search_query !== query
    );
    setSearchHistory(tempHistory);
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
            <ul className='smart-search-list'>
              <li className='sentiment-item'>
                <CircleCheckbox
                  checked={shouldShowSentiment}
                  onChange={() => handleSentimentChange('positive')}
                  isDisabled={true}
                />
                <span className='sentiment-text positive'>Positive</span> and{' '}
                <span className='sentiment-text negative'>Negative</span>{' '}
                <span>Sentiments</span>
              </li>
              {searchHistory.map((item, index) => (
                <li
                  className='smart-search-item'
                  key={index}
                  onClick={() => handleSearchChange(item.search_query)}
                >
                  <CircleCheckbox
                    checked={item.show}
                    onChange={() => handleSearchChange(item.search_query)}
                  />
                  <span>{item.search_query}</span>
                  <span
                    className='remove-search'
                    onClick={(e) => handleRemoveSearch(item.search_query, e)}
                  >
                    &#x2715;
                  </span>
                </li>
              ))}
            </ul>
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
          setReference={setReference}
        />
      </div>
    </div>
  );
};

export default LeftColumn;

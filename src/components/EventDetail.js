import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchBox from './SearchBox';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import './css/EventDetail.css';

const EventDetail = ({ axiosInstance }) => {
  const ref = useRef(null);
  const location = useLocation();
  const { year, quarter, conferenceDate, symbol, exchange, name } =
    location.state || {};
  const [errorMessage, setErrorMessage] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchTranscriptData = async () => {
      if (ref.current) return; // If we've already fetched, don't fetch again
      ref.current = true;
      try {
        const response = await axiosInstance.post(
          'http://localhost:8000/api/stock-data/',
          {
            exchange,
            symbol,
            year,
            quarter,
            level: 1,
          }
        );
        setTranscriptData(response.data);
      } catch (error) {
        console.error('Error fetching transcript data:', error);
        setErrorMessage(
          'An error occurred while fetching the transcript data.'
        );
      }
    };

    if (exchange && symbol && year && quarter) {
      fetchTranscriptData();
    }
  }, [exchange, symbol, year, quarter, name, conferenceDate, axiosInstance]);

  const handleSearch = async (e) => {
    // ... existing handleSearch function ...
  };

  return (
    <div className='event-detail-container'>
      <header className='event-detail-header'>
        <SearchBox />
      </header>
      <main className='event-detail-main'>
        <LeftColumn
          transcriptData={transcriptData}
          company_symbol={symbol}
          year={year}
          quarter={quarter}
          name={name}
          conferenceDate={conferenceDate}
          exchange={exchange}
          axiosInstance={axiosInstance}
        />
        <RightColumn
          transcriptData={transcriptData}
          company_symbol={symbol}
          year={year}
          quarter={quarter}
          name={name}
          conferenceDate={conferenceDate}
          exchange={exchange}
          axiosInstance={axiosInstance}
        />
      </main>
    </div>
  );
};

export default EventDetail;

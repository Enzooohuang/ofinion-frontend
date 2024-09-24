import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SearchBox from './SearchBox';
import LeftColumn from './LeftColumn';
import RightColumn from './RightColumn';
import './css/EventDetail.css';

const EventDetail = ({ axiosInstance }) => {
  const location = useLocation();
  const { year, quarter, conferenceDate, symbol, exchange, name } =
    location.state || {};
  const [transcriptData, setTranscriptData] = useState(null);
  const [reference, setReference] = useState(null);
  const [eventDetails, setEventDetails] = useState({
    exchange: exchange,
    symbol: symbol,
    year: year,
    quarter: quarter,
    name: name,
    conferenceDate: conferenceDate,
  });
  const [searchHistory, setSearchHistory] = useState([]);
  const [shouldShowSentiment, setShouldShowSentiment] = useState(true);

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        const response = await axiosInstance.post(
          'http://localhost:8000/api/stock-data/',
          {
            exchange: eventDetails.exchange,
            symbol: eventDetails.symbol,
            year: eventDetails.year,
            quarter: eventDetails.quarter,
            level: 1,
          }
        );
        setTranscriptData(response.data);
      } catch (error) {
        console.error('Error fetching transcript data:', error);
      }
    };

    if (
      eventDetails.exchange &&
      eventDetails.symbol &&
      eventDetails.year &&
      eventDetails.quarter
    ) {
      fetchTranscriptData();
    }
  }, [eventDetails, axiosInstance]);

  const handleSearch = (searchParams) => {
    // Reset transcriptData to trigger a reload of AIConversation
    setTranscriptData(null);
    setEventDetails(searchParams);
  };

  return (
    <div className='event-detail-container'>
      <header className='event-detail-header'>
        <SearchBox onSearch={handleSearch} />
      </header>
      <main className='event-detail-main'>
        <LeftColumn
          transcriptData={transcriptData}
          company_symbol={eventDetails.symbol}
          year={eventDetails.year}
          quarter={eventDetails.quarter}
          name={eventDetails.name}
          conferenceDate={eventDetails.conferenceDate}
          exchange={eventDetails.exchange}
          axiosInstance={axiosInstance}
          key={`${eventDetails.symbol}-${eventDetails.year}-${eventDetails.quarter}`} // Add this line
          setReference={setReference}
          searchHistory={searchHistory}
          setSearchHistory={setSearchHistory}
          shouldShowSentiment={shouldShowSentiment}
          setShouldShowSentiment={setShouldShowSentiment}
        />
        {eventDetails && (
          <RightColumn
            transcriptData={transcriptData}
            company_symbol={eventDetails.symbol}
            year={eventDetails.year}
            quarter={eventDetails.quarter}
            name={eventDetails.name}
            conferenceDate={eventDetails.conferenceDate}
            exchange={eventDetails.exchange}
            axiosInstance={axiosInstance}
            reference={reference}
            searchHistory={searchHistory}
            setSearchHistory={setSearchHistory}
            shouldShowSentiment={shouldShowSentiment}
          />
        )}
      </main>
    </div>
  );
};

export default EventDetail;

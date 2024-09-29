import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/EarningsEventsList.css';
import { useNavigate } from 'react-router-dom';

const EarningsEventsList = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          'http://localhost:8000/api/recent-company-events/'
        );
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleClick = (event) => {
    navigate(`/stock/${event.symbol}/Q${event.quarter}-${event.year}`, {
      state: {
        year: event.year,
        quarter: event.quarter,
        conferenceDate: event.conference_date,
        symbol: event.symbol,
        exchange: event.exchange,
        name: event.name,
      },
    });
  };

  return (
    <div className='earnings-events-container'>
      <h2 className='earnings-events-title'>Recent Earnings Transcripts</h2>
      {isLoading ? (
        <div className='loading-indicator'>
          <div className='loading-spinner'></div>
        </div>
      ) : (
        <div className='earnings-events-list'>
          {events.map((event, index) => (
            <div
              key={index}
              className='earnings-event-item'
              onClick={() => handleClick(event)}
            >
              <span className='recent-company-name'>{event.name}</span>
              <span className='year-quarter'>{`${event.year} Q${event.quarter}`}</span>
              <span className='conference-date'>
                {new Date(event.conference_date).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EarningsEventsList;

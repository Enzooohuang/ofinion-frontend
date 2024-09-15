import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const StockDetail = () => {
  const { symbol } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { exchange, name } = location.state || {};
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchCompanyEvents = async () => {
      if (!exchange || !symbol) return;
      try {
        const response = await axios.post(
          'http://localhost:8000/api/company-events/',
          {
            exchange: exchange,
            symbol: symbol,
          }
        );
        setEvents(response.data.events);
      } catch (error) {
        console.error('Error fetching company events:', error);
      }
    };

    fetchCompanyEvents();
  }, [exchange, symbol]);

  const handleEventClick = (year, quarter, conferenceDate) => {
    navigate(`/stock/${symbol}/event`, {
      state: { year, quarter, conferenceDate, symbol, exchange, name },
    });
  };

  if (!exchange || !name) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Stock Details for {symbol}</h1>
      <p>Exchange: {exchange}</p>
      <p>Company Name: {name}</p>
      <h2>Company Events</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {events.map((event, index) => (
          <button
            key={index}
            onClick={() =>
              handleEventClick(event.year, event.quarter, event.conference_date)
            }
            style={{
              padding: '10px',
              margin: '5px',
              backgroundColor: '#f0f0f0',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            {event.year} Q{event.quarter}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StockDetail;

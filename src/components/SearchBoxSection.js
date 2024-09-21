import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/SearchBoxSection.css';
import { FaSearch, FaTimes } from 'react-icons/fa'; // Added FaTimes for the delete icon

const SearchBoxSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(
          'http://localhost:8000/api/companies/'
        );
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (selectedCompany) {
        try {
          const response = await axios.post(
            'http://localhost:8000/api/company-events/',
            {
              exchange: selectedCompany.exchange,
              symbol: selectedCompany.symbol,
            }
          );
          // Add id to each event
          const eventsWithId = response.data.events.map((event, index) => ({
            ...event,
            id: index,
          }));
          setEvents(eventsWithId);
        } catch (error) {
          console.error('Error fetching events:', error);
        }
      }
    };
    fetchEvents();
  }, [selectedCompany]);

  // Search function wrapped in useCallback
  const searchCompanies = useCallback(
    (term) => {
      if (term.length === 0) {
        return companies.slice(0, 5);
      }
      const lowercasedTerm = term.toLowerCase();
      return companies
        .filter((company) => {
          const symbol = company.symbol.toLowerCase();
          const name = company.name.toLowerCase();
          return (
            symbol.startsWith(lowercasedTerm) || name.startsWith(lowercasedTerm)
          );
        })
        .slice(0, 10); // Limit to 10 results
    },
    [companies]
  );

  useEffect(() => {
    const results = searchCompanies(searchTerm);
    setSearchResults(results);
  }, [searchTerm, searchCompanies]);

  const handleSelectStock = (symbol, exchange, name) => {
    setSelectedCompany({ symbol, exchange, name });
    setSearchTerm('');
    setIsInputFocused(false);
  };

  const handleDeleteToken = () => {
    setSelectedCompany(null);
    setSearchTerm('');
    setEvents([]);
  };

  const handleInputFocus = () => {
    setIsInputFocused(true);
    if (searchTerm.length === 0) {
      setSearchResults(companies.slice(0, 5));
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsInputFocused(false);
    }, 200);
  };

  const handleEventChange = (e) => {
    const eventId = e.target.value;
    setSelectedEvent(events[eventId]);
  };

  const handleSearchClick = () => {
    navigate(`/stock/${selectedCompany.symbol}/event`, {
      state: {
        year: selectedEvent.year,
        quarter: selectedEvent.quarter,
        conferenceDate: selectedEvent.conference_date,
        symbol: selectedCompany.symbol,
        exchange: selectedCompany.exchange,
        name: selectedCompany.name,
      },
    });
  };

  return (
    <div className='box box5'>
      <h1 className='box5-title'>Check yourself ~</h1>
      <div className='search-container'>
        <div className='search-input-wrapper'>
          {selectedCompany ? (
            <div className='selected-token'>
              <span>{`${selectedCompany.symbol} - ${selectedCompany.name}`}</span>
              <FaTimes
                className='delete-icon'
                onClick={handleDeleteToken}
              />
            </div>
          ) : (
            <>
              <FaSearch className='search-icon' />
              <input
                type='text'
                placeholder='Search stocks...'
                className='search-box'
                ref={inputRef}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
              />
            </>
          )}
          {isInputFocused && searchResults.length > 0 && !selectedCompany && (
            <ul className='search-results'>
              {searchResults.map((result) => (
                <li
                  key={result.symbol}
                  onMouseDown={() =>
                    handleSelectStock(
                      result.symbol,
                      result.exchange,
                      result.name
                    )
                  }
                >
                  {result.symbol} - {result.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <select
          className='dropdown'
          disabled={!selectedCompany}
          onChange={handleEventChange}
        >
          <option value=''>Choose event</option>
          {events.map((event, index) => (
            <option
              key={index}
              value={event.id}
            >
              {event.year} Q{event.quarter}
            </option>
          ))}
        </select>
        <button
          className='search-button'
          onClick={handleSearchClick}
          disabled={!selectedEvent}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBoxSection;

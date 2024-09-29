import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import './css/SearchBox.css';
import { useNavigate } from 'react-router-dom';

const SearchBox = ({ axiosInstance, baseUrl, onSearch }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get(`${baseUrl}/api/companies/`);
        return response.data;
      } catch (error) {
        console.error('Error fetching companies:', error);
        return [];
      }
    };
    const getCompanies = async () => {
      const fetchedCompanies = await fetchCompanies();
      setCompanies(fetchedCompanies);
    };
    getCompanies();
  }, [axiosInstance, baseUrl]);

  useEffect(() => {
    const fetchEvents = async (selectedCompany) => {
      try {
        const response = await axiosInstance.post(
          `${baseUrl}/api/company-events/`,
          {
            exchange: selectedCompany.exchange,
            symbol: selectedCompany.symbol,
          }
        );
        return response.data.events;
      } catch (error) {
        console.error('Error fetching events:', error);
        return [];
      }
    };

    const getEvents = async () => {
      if (selectedCompany) {
        const fetchedEvents = await fetchEvents(selectedCompany);
        const eventsWithId = fetchedEvents.map((event, index) => ({
          ...event,
          id: index,
        }));
        setEvents(eventsWithId);
      }
    };
    getEvents();
  }, [axiosInstance, baseUrl, selectedCompany]);

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
        .slice(0, 10);
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
    setSelectedEvent(null);
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
    const eventId = parseInt(e.target.value);
    setSelectedEvent(events[eventId]);
  };

  const handleSearch = () => {
    navigate(
      `/stock/${selectedCompany.symbol}/Q${selectedEvent.quarter}-${selectedEvent.year}`,
      {
        state: {
          year: selectedEvent.year,
          quarter: selectedEvent.quarter,
          conferenceDate: selectedEvent.conference_date,
          symbol: selectedCompany.symbol,
          exchange: selectedCompany.exchange,
          name: selectedCompany.name,
        },
      }
    );
  };

  const handleSearchClick = () => {
    if (selectedCompany && selectedEvent) {
      if (onSearch) {
        handleSubmitNewEvent();
      } else {
        handleSearch();
      }
    }
  };

  const handleSubmitNewEvent = () => {
    onSearch({
      exchange: selectedCompany.exchange,
      symbol: selectedCompany.symbol,
      year: selectedEvent.year,
      quarter: selectedEvent.quarter,
      name: selectedCompany.name,
      conferenceDate: selectedEvent.conference_date,
    });
    navigate(
      `/stock/${selectedCompany.symbol}/Q${selectedEvent.quarter}-${selectedEvent.year}`,
      {
        state: {
          year: selectedEvent.year,
          quarter: selectedEvent.quarter,
          conferenceDate: selectedEvent.conference_date,
          symbol: selectedCompany.symbol,
          exchange: selectedCompany.exchange,
          name: selectedCompany.name,
        },
      }
    );
  };

  return (
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
                  handleSelectStock(result.symbol, result.exchange, result.name)
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
        value={selectedEvent ? selectedEvent.id : ''}
      >
        <option value=''>Choose event</option>
        {events.map((event) => (
          <option
            key={event.id}
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
  );
};

export default SearchBox;

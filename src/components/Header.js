import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Header = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [companies, setCompanies] = useState([]);
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
    navigate(`/stock/${symbol}`, { state: { exchange, name } });
    setSearchTerm('');
    setIsInputFocused(false);
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

  return (
    <header
      style={{
        backgroundColor: '#f0f0f0',
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%', // Ensure the header takes full width
      }}
    >
      {/* Remove the toggleSidebar button */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '50%',
          maxWidth: '500px',
        }}
      >
        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={inputRef}
            type='text'
            placeholder='Search stocks...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              width: '100%',
            }}
          />
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            style={{
              position: 'absolute',
              right: '0.25rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#888',
              width: '1.2em',
              height: '1.2em',
              pointerEvents: 'none',
            }}
          >
            <circle
              cx='11'
              cy='11'
              r='8'
            ></circle>
            <line
              x1='21'
              y1='21'
              x2='16.65'
              y2='16.65'
            ></line>
          </svg>
        </div>
        {isInputFocused && searchResults.length > 0 && (
          <ul
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: 'white',
              border: '1px solid #ccc',
              borderRadius: '4px',
              listStyle: 'none',
              padding: 0,
              margin: 0,
              zIndex: 1000,
              width: '100%',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            {searchResults.map((result) => (
              <li
                key={result.symbol}
                onMouseDown={() =>
                  handleSelectStock(result.symbol, result.exchange, result.name)
                }
                style={{
                  padding: '0.5rem',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = '#f0f0f0')
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = 'transparent')
                }
              >
                {result.symbol} - {result.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        {user ? (
          <>
            <span>
              Welcome, {user.email}, you have {user.times_remaining} times
              remaining
            </span>
            <button
              onClick={onLogout}
              style={
                {
                  /* ... button styles ... */
                }
              }
            >
              Log Out
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate('/join')}
              style={
                {
                  /* ... button styles ... */
                }
              }
            >
              Join Free
            </button>
            <button
              onClick={() => navigate('/login')}
              style={
                {
                  /* ... button styles ... */
                }
              }
            >
              Log In
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;

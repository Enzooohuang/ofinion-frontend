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
    setSelectedCompany({ symbol, exchange, name });
    setSearchTerm('');
    setIsInputFocused(false);
  };

  const handleDeleteToken = () => {
    setSelectedCompany(null);
    setSearchTerm('');
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
        >
          <option value=''>Choose quarter</option>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </select>
        <button className='search-button'>Search</button>
      </div>
    </div>
  );
};

export default SearchBoxSection;

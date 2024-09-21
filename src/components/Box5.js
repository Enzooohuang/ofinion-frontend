import React, { useState } from 'react';
import './css/Box5.css';
import { FaSearch } from 'react-icons/fa'; // Make sure to install react-icons

const Box5 = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // This is a dummy search function. Replace it with your actual search logic.
  const handleSearch = (term) => {
    // Dummy results for demonstration
    const dummyResults = [
      'Result 1',
      'Result 2',
      'Result 3',
      'Result 4',
      'Result 5',
    ].filter((result) => result.toLowerCase().includes(term.toLowerCase()));
    setSearchResults(dummyResults);
  };

  return (
    <div className='box box5'>
      <h1 className='box5-title'>Check yourself ~</h1>
      <div className='search-container'>
        <div className='search-input-wrapper'>
          <FaSearch className='search-icon' />
          <input
            type='text'
            placeholder='Search...'
            className='search-box'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              handleSearch(e.target.value);
            }}
          />
        </div>
        <select className='dropdown'>
          <option value=''>Select option</option>
          <option value='option1'>Option 1</option>
          <option value='option2'>Option 2</option>
          <option value='option3'>Option 3</option>
        </select>
        <button className='search-button'>Search</button>
      </div>
      {searchResults.length > 0 && (
        <ul className='search-results'>
          {searchResults.map((result, index) => (
            <li key={index}>{result}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Box5;

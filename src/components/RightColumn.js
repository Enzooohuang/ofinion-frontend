import React from 'react';
import './css/RightColumn.css';

const RightColumn = ({
  transcriptData,
  searchKeyword,
  handleSearch,
  searchResults,
}) => {
  return (
    <div className='right-column'>
      <h2>Transcript</h2>
      <form onSubmit={handleSearch}>
        <input
          type='text'
          value={searchKeyword}
          onChange={() => {}}
          placeholder='Search transcript...'
        />
        <button type='submit'>Search</button>
      </form>
      {transcriptData && (
        <div className='transcript-content'>
          {/* Add your transcript content here */}
        </div>
      )}
      {searchResults.length > 0 && (
        <div className='search-results'>
          <h3>Search Results:</h3>
          <ul>
            {searchResults.map((result, index) => (
              <li key={index}>{result}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RightColumn;

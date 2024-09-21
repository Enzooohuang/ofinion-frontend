import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

const EventDetail = () => {
  const location = useLocation();
  const { year, quarter, conferenceDate, symbol, exchange, name } =
    location.state || {};
  const [errorMessage, setErrorMessage] = useState(null);
  const [transcriptData, setTranscriptData] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [lastSearchedKeyword, setLastSearchedKeyword] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchTranscriptData = async () => {
      try {
        const response = await axios.post(
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
  }, [exchange, symbol, year, quarter]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (
      !searchKeyword.trim() ||
      !transcriptData ||
      searchKeyword === lastSearchedKeyword
    )
      return;

    try {
      const response = await axios.post(
        'http://127.0.0.1:8000/api/extract-sentences/',
        {
          keyword: searchKeyword,
          article: transcriptData.text,
        }
      );

      const sentences = response.data.extracted_sentences
        .split('\n\n')
        .map((sentence) => sentence.trim());
      setSearchResults(sentences);
      setLastSearchedKeyword(searchKeyword);
    } catch (error) {
      console.error('Error searching transcript:', error);
      setErrorMessage('An error occurred while searching the transcript.');
    }
  };

  const highlightText = (text, sentences) => {
    let highlightedText = text;
    sentences.forEach((sentence) => {
      // Remove leading/trailing ellipsis and periods
      const cleanSentence = sentence
        .replace(/^\.\.\.|\.\.\.$|^\.|\.$/g, '')
        .trim();
      // Escape special characters for regex
      const escapedSentence = cleanSentence.replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      );
      const regex = new RegExp(`(${escapedSentence})`, 'gi');
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
    });
    return { __html: highlightedText };
  };

  return (
    <div>
      <h1>Event Details for {symbol}</h1>
      <p>Company: {name}</p>
      <p>Exchange: {exchange}</p>
      <p>Year: {year}</p>
      <p>Quarter: {quarter}</p>
      <p>Conference Date: {new Date(conferenceDate).toLocaleString()}</p>

      <Link
        to={`/`}
        state={{ exchange, name }}
      >
        Back
      </Link>

      {errorMessage && (
        <div style={{ color: 'red', marginTop: '1rem' }}>
          <h2>Error</h2>
          <p>{errorMessage}</p>
        </div>
      )}

      {transcriptData && (
        <div>
          <h2>
            Transcript
            <form
              onSubmit={handleSearch}
              style={{ display: 'inline', marginLeft: '1rem' }}
            >
              <input
                type='text'
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder='Search transcript...'
              />
              <button type='submit'>Search</button>
            </form>
          </h2>
          <div
            dangerouslySetInnerHTML={highlightText(
              transcriptData.text,
              searchResults
            )}
          />

          {/* {searchResults.length > 0 && (
            <div>
              <h3>Search Results for "{lastSearchedKeyword}":</h3>
              <ul>
                {searchResults.map((sentence, index) => (
                  <li key={index}>{sentence}</li>
                ))}
              </ul>
            </div>
          )} */}
        </div>
      )}
    </div>
  );
};

export default EventDetail;

import React, { useState, useEffect } from 'react';
import './css/RightColumn.css'; // We'll create this CSS file
import { ChevronIcon } from './LeftColumn';
const RightColumn = ({
  transcriptData,
  advancedTranscriptData,
  company_symbol,
  year,
  quarter,
  name,
  conferenceDate,
  exchange,
  axiosInstance,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [positivePoints, setPositivePoints] = useState([]);
  const [negativePoints, setNegativePoints] = useState([]);
  const [futureGuidance, setFutureGuidance] = useState([]);
  const [qaPairs, setQaPairs] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    console.log(transcriptData);
    console.log(advancedTranscriptData);
    const analyzeTranscript = async () => {
      try {
        const response = await axiosInstance.post(
          'http://localhost:8000/api/analyze-transcript/',
          {
            exchange: exchange.toUpperCase(),
            transcript: transcriptData,
            company_symbol,
            year,
            quarter,
            name,
            conference_date: conferenceDate,
          }
        );

        // Parse the response
        const data = response.data;
        setSummary(data.summary || '');

        // Parse the string representations of lists
        const parseStringList = (str) => {
          if (typeof str === 'string') {
            try {
              const jsonStr = str
                .replace(/(?<=\{|,)\s*'\s*(\w+)\s*'\s*:/g, '"$1":')
                .replace(/:\s*'([^']*)'/g, ':"$1"');
              return JSON.parse(jsonStr);
            } catch (error) {
              console.error('Error parsing string list:', error);
              return [];
            }
          }
          return str || [];
        };

        setPositivePoints(parseStringList(data.positive_points));
        setNegativePoints(parseStringList(data.negative_points));
        setFutureGuidance(parseStringList(data.future_guidance));
      } catch (error) {
        console.error('Error analyzing transcript:', error);
      }
    };

    const fetchQaPairs = async () => {
      try {
        const response = await axiosInstance.post(
          'http://localhost:8000/api/paraphrase-qa/',
          {
            exchange: exchange.toUpperCase(),
            transcript: transcriptData,
            company_symbol,
            year,
            quarter,
            name,
            conference_date: conferenceDate,
          }
        );
        console.log(response.data);
        setQaPairs(response.data.qa_pairs);
      } catch (error) {
        console.error('Error fetching QA pairs:', error);
      }
    };

    if (transcriptData) {
      analyzeTranscript();
      fetchQaPairs();
    }
  }, [
    transcriptData,
    exchange,
    company_symbol,
    year,
    quarter,
    name,
    conferenceDate,
    axiosInstance,
    advancedTranscriptData,
  ]);

  const toggleQuestion = (index) => {
    setExpandedQuestions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      'Jan.',
      'Feb.',
      'Mar.',
      'Apr.',
      'May',
      'Jun.',
      'Jul.',
      'Aug.',
      'Sep.',
      'Oct.',
      'Nov.',
      'Dec.',
    ];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    // Function to add ordinal suffix to day
    const getOrdinalSuffix = (d) => {
      if (d > 3 && d < 21) return 'th';
      switch (d % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)} ${year}`;
  };

  // Format the conferenceDate
  const formattedDate = formatDate(conferenceDate);

  // Dummy function for search
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent form submission
    console.log('Search query:', searchQuery);
    // Here you would typically make an API call
    // For now, we'll just log the query
  };

  // Handle key press in the search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className='right-column'>
      <header className='right-column-header'>
        <div className='right-column-header-texts'>
          <h2 className='company-name'>{name}</h2>
          <h2 className='company-symbol'>{company_symbol}</h2>
        </div>
        <div className='right-column-header-texts'>
          <h2 className='earnings-call-title'>
            Q{quarter} {year} Earnings Call
          </h2>
          <h2 className='earnings-call-date'>{formattedDate}</h2>
        </div>
      </header>
      <div className='right-column-content'>
        <div className='left-section'>
          <div className='search-form'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder='Search keywords...'
              className='search-input'
            />
          </div>
          {/* Content for the left section (25% width) */}
        </div>
        <div className='right-section'>
          <div className='scrollable-content'>
            <div className='summary-section'>
              <div className='summary-row summary'>
                <h3>Summary</h3>
                <p>{summary}</p>
              </div>
              <div className='summary-row'>
                <div className='summary-col positive'>
                  <h4>Positive Points</h4>
                  <ul>
                    {positivePoints.map((point, index) => (
                      <li key={index}>
                        • {point.point}
                        <span
                          className='reference'
                          onClick={() =>
                            console.log('Positive reference:', point.reference)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          [{index + 1}]
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='summary-col negative'>
                  <h4>Negative Points</h4>
                  <ul>
                    {negativePoints.map((point, index) => (
                      <li key={index}>
                        • {point.point}{' '}
                        <span
                          className='reference'
                          onClick={() =>
                            console.log('Negative reference:', point.reference)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          [{index + 1}]
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className='summary-col outlook'>
                  <h4>Future Guidance</h4>
                  <ul>
                    {futureGuidance.map((point, index) => (
                      <li key={index}>
                        • {point.guidance}{' '}
                        <span
                          className='reference'
                          onClick={() =>
                            console.log('Guidance reference:', point.reference)
                          }
                          style={{ cursor: 'pointer' }}
                        >
                          [{index + 1}]
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className='qa-pairs-section'>
              <h3>Q&A Highlights</h3>
              {qaPairs.map((pair, index) => (
                <div key={index}>
                  <p
                    className='question'
                    onClick={() => toggleQuestion(index)}
                  >
                    <span className='question-text'>
                      <strong>Q:</strong> {pair.objective_question}
                    </span>
                    <span className='toggle-icon'>
                      <ChevronIcon isOpen={expandedQuestions[index]} />
                    </span>
                  </p>
                  {expandedQuestions[index] && (
                    <p className='answer'>
                      <strong>A:</strong> {pair.comprehensive_answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <div className='transcript-section'>
              <h3>Transcript</h3>
              {advancedTranscriptData.map((item, index) => (
                <div
                  key={index}
                  className='transcript-item'
                >
                  <p className='speaker-name'>{item.name}</p>
                  <p className='speaker-text'>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightColumn;

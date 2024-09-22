import React, { useState, useEffect } from 'react';
import './css/RightColumn.css';
import { ChevronIcon } from './LeftColumn';

const RightColumn = ({
  transcriptData,
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
  const [advancedTranscriptData, setAdvancedTranscriptData] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [loading, setLoading] = useState({
    summary: true,
    points: true,
    qaPairs: true,
    transcript: true,
  });

  useEffect(() => {
    const analyzeTranscript = async () => {
      setLoading((prev) => ({ ...prev, summary: true, points: true }));
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
      } finally {
        setLoading((prev) => ({ ...prev, summary: false, points: false }));
      }
    };

    const fetchQaPairs = async () => {
      setLoading((prev) => ({ ...prev, qaPairs: true }));
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
      } finally {
        setLoading((prev) => ({ ...prev, qaPairs: false }));
      }
    };

    const fetchAdvancedTranscript = async () => {
      setLoading((prev) => ({ ...prev, transcript: true }));
      try {
        const responseAdvanced = await axiosInstance.post(
          'http://localhost:8000/api/stock-data/',
          {
            exchange,
            symbol: company_symbol,
            year,
            quarter,
            level: 2,
          }
        );
        console.log(responseAdvanced.data.speakers);
        setAdvancedTranscriptData(responseAdvanced.data.speakers);
      } catch (error) {
        console.error('Error fetching advanced transcript:', error);
      } finally {
        setLoading((prev) => ({ ...prev, transcript: false }));
      }
    };

    if (transcriptData) {
      analyzeTranscript();
      fetchQaPairs();
      fetchAdvancedTranscript();
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
  ]);

  useEffect(() => {
    if (advancedTranscriptData) {
      setLoading((prev) => ({ ...prev, transcript: false }));
    }
  }, [advancedTranscriptData]);

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
                {loading.summary ? (
                  <div className='loading-indicator'>Loading summary...</div>
                ) : (
                  <p>{summary}</p>
                )}
              </div>
              <div className='summary-row'>
                {['positive', 'negative', 'outlook'].map((type, index) => (
                  <div
                    key={index}
                    className={`summary-col ${type}`}
                  >
                    <h4>
                      {type === 'outlook'
                        ? 'Future Guidance'
                        : `${
                            type.charAt(0).toUpperCase() + type.slice(1)
                          } Points`}
                    </h4>
                    {loading.points ? (
                      <div className='loading-indicator'>
                        Loading {type} points...
                      </div>
                    ) : (
                      <ul>
                        {(type === 'positive'
                          ? positivePoints
                          : type === 'negative'
                          ? negativePoints
                          : futureGuidance
                        ).map((point, idx) => (
                          <li key={idx}>
                            • {point.point || point.guidance}
                            <span
                              className='reference'
                              onClick={() =>
                                console.log(
                                  `${type} reference:`,
                                  point.reference
                                )
                              }
                            >
                              [{idx + 1}]
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className='qa-pairs-section'>
              <h3>Q&A Highlights</h3>
              {loading.qaPairs ? (
                <div className='loading-indicator'>Loading Q&A pairs...</div>
              ) : (
                qaPairs.map((pair, index) => (
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
                ))
              )}
            </div>
            <div className='transcript-section'>
              <h3>Transcript</h3>
              {loading.transcript ? (
                <div className='loading-indicator'>Loading transcript...</div>
              ) : (
                advancedTranscriptData &&
                advancedTranscriptData.map((item, index) => (
                  <div
                    key={index}
                    className='transcript-item'
                  >
                    <p className='speaker-name'>{item.name}</p>
                    <p className='speaker-text'>{item.text}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightColumn;

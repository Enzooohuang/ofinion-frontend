import React, { useState, useEffect, useRef } from 'react';
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
  reference,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [summary, setSummary] = useState('');
  const [positivePoints, setPositivePoints] = useState([]);
  const [negativePoints, setNegativePoints] = useState([]);
  const [futureGuidance, setFutureGuidance] = useState([]);
  const [qaPairs, setQaPairs] = useState([]);
  const [advancedTranscriptData, setAdvancedTranscriptData] = useState([]);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [positiveSentiments, setPositiveSentiments] = useState([]);
  const [negativeSentiments, setNegativeSentiments] = useState([]);
  const [loading, setLoading] = useState({
    summary: true,
    points: true,
    qaPairs: true,
    transcript: true,
  });
  const transcriptRef = useRef(null);

  const should_mark_positive = true;
  const should_mark_negative = true;

  const findSentenceSpan = (element, searchText) => {
    const spans = element.querySelectorAll('span[data-sentence]');
    for (const span of spans) {
      const spanText = span.getAttribute('data-sentence');
      if (
        spanText.toLowerCase().includes(searchText.toLowerCase()) ||
        searchText.toLowerCase().includes(spanText.toLowerCase())
      ) {
        return span;
      }
    }
    return null;
  };

  const highlightSentiment = (text) => {
    if (!positiveSentiments || !negativeSentiments) {
      return text;
    }
    if (!positiveSentiments.length && !negativeSentiments.length) return text;

    let highlightedText = text;
    const sentiments = [...positiveSentiments, ...negativeSentiments];
    sentiments.sort((a, b) => b.sentence.length - a.sentence.length);

    sentiments.forEach((sentiment) => {
      const { sentence, score } = sentiment;
      const isPositive = positiveSentiments.includes(sentiment);
      const color = isPositive
        ? `rgba(0, 128, 0, ${Math.min(Math.abs(score) * 0.1, 1.0)})`
        : `rgba(255, 0, 0, ${Math.min(Math.abs(score) * 0.1, 1.0)})`;

      let trimmedSentence = sentence.trim();
      if (trimmedSentence.endsWith('.')) {
        trimmedSentence = trimmedSentence.slice(0, -1);
      }

      let matchedSpan = findSentenceSpan(
        transcriptRef.current,
        trimmedSentence
      );
      if (matchedSpan) {
        matchedSpan.style.borderBottom = `2px solid ${color}`;
      }
    });

    return highlightedText;
  };

  const handleReferenceClick = (reference) => {
    // Split the reference into sentences
    const sentenceRegex = /([.!?])\s+(?=[A-Z])/g;
    const referenceSentences = reference.split(sentenceRegex) || [reference];

    let matchedSpan = null;

    for (const sentence of referenceSentences) {
      let trimmedSentence = sentence.trim();
      if (trimmedSentence.endsWith('.')) {
        trimmedSentence = trimmedSentence.slice(0, -1);
      }

      matchedSpan = findSentenceSpan(transcriptRef.current, trimmedSentence);
    }

    if (matchedSpan) {
      matchedSpan.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
      console.log('Scrolling to element');

      // Highlight the matched span
      matchedSpan.classList.add('highlighted-sentence');
      setTimeout(() => {
        matchedSpan.classList.remove('highlighted-sentence');
      }, 3000); // Remove highlight after 3 seconds
    } else {
      console.log('No matching text found in transcript');
    }
  };

  useEffect(() => {
    console.log('reference:', reference);
    if (reference) {
      handleReferenceClick(reference);
    }
  }, [reference]);

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
        setAdvancedTranscriptData(responseAdvanced.data.speakers);
      } catch (error) {
        console.error('Error fetching advanced transcript:', error);
      } finally {
        setLoading((prev) => ({ ...prev, transcript: false }));
      }
    };

    const fetchSentimentAnalysis = async () => {
      try {
        const response = await axiosInstance.post(
          'http://localhost:8000/api/analyze-sentiment/',
          {
            exchange,
            transcript: transcriptData,
            company_symbol,
            year,
            quarter,
            name,
            conference_date: conferenceDate,
          }
        );
        console.log('response.data:', response.data);
        setPositiveSentiments(response.data.positive_sentiments);
        setNegativeSentiments(response.data.negative_sentiments);
      } catch (error) {
        console.error('Error fetching sentiment analysis:', error);
      } finally {
      }
    };

    if (transcriptData) {
      analyzeTranscript();
      fetchQaPairs();
      fetchAdvancedTranscript();
      fetchSentimentAnalysis();
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

  const renderTranscriptText = (text) => {
    if (!text) return '';

    // Regular expression to match sentences, avoiding decimal points
    const sentenceRegex = /([.!?])\s+(?=[A-Z])/g;
    const sentences = text.split(sentenceRegex) || [text];
    const formattedSentences = [];
    for (let i = 0; i < sentences.length - 1; i += 2) {
      formattedSentences.push(sentences[i] + sentences[i + 1]);
    }

    return formattedSentences
      .map((sentence, index) => {
        return `<span data-sentence="${sentence.trim()}" data-index="${index}">${sentence}</span>`;
      })
      .join(' ');
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
                                handleReferenceClick(point.reference)
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
            <div
              className='transcript-section'
              ref={transcriptRef}
            >
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
                    <p
                      className='speaker-text'
                      dangerouslySetInnerHTML={{
                        __html: renderTranscriptText(
                          should_mark_positive || should_mark_negative
                            ? highlightSentiment(item.text)
                            : item.text
                        ),
                      }}
                    />
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

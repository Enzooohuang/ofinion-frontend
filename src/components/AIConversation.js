import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './css/AIConversation.css';
import defaultUserImage from '../assets/defaultimage.jpg';
import defaultAIImage from '../assets/smalllogo.png';

// Add this import at the top of your file
import { FaPaperPlane } from 'react-icons/fa';

const LoadingIndicator = () => (
  <div className='loading-indicator'>
    <div className='dot'></div>
    <div className='dot'></div>
    <div className='dot'></div>
  </div>
);

const AIConversation = ({ transcript, company_symbol, year, quarter }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [expertQuestions, setExpertQuestions] = useState([]);
  const [askedQuestions, setAskedQuestions] = useState(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef(null);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      const scrollHeight = messageListRef.current.scrollHeight;
      const height = messageListRef.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      messageListRef.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchExpertQuestions = async () => {
      if (!transcript || !company_symbol || !year || !quarter) {
        return;
      }
      try {
        const response = await axios.post(
          'http://localhost:8000/api/generate-expert-questions/',
          {
            transcript,
            company_symbol,
            year,
            quarter,
          }
        );
        setExpertQuestions(response.data.expert_questions);
      } catch (error) {
        console.error('Error fetching expert questions:', error);
      }
    };
    if (messages.length === 0) {
      fetchExpertQuestions();
    }
  }, [messages, transcript, company_symbol, year, quarter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      askQuestion(input);
    }
  };

  const handleExpertQuestionClick = (question) => {
    askQuestion(question);
  };

  const askQuestion = (question) => {
    setMessages([...messages, { text: question, sender: 'user' }]);
    setInput('');
    setAskedQuestions(new Set([...askedQuestions, question]));
    getAIResponse(question);
  };

  const getAIResponse = async (question) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:8000/api/answer-question/',
        {
          transcript,
          question,
        }
      );

      const answer = response.data.answer;

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: question,
          sender: 'ai',
          answer: answer,
        },
      ]);

      const questionsShouldBeFiltered = new Set([...askedQuestions, question]);
      // Show remaining expert questions
      const remainingQuestions = expertQuestions.filter(
        (q) => !questionsShouldBeFiltered.has(q)
      );

      if (remainingQuestions.length > 0) {
        setTimeout(() => {
          setMessages((prevMessages) => [
            ...prevMessages,
            {
              text: 'Maybe you also want to ask...',
              sender: 'ai',
              isFollowUp: true,
              followUpQuestions: remainingQuestions,
            },
          ]);
        }, 1000);
      }
    } catch (error) {
      console.error('Error getting AI response:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: "I'm sorry, I couldn't process your question at the moment. Please try again later.",
          sender: 'ai',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferenceClick = (reference) => {
    console.log('Reference clicked:', reference);
  };

  return (
    <div className='ai-conversation'>
      {messages.length === 0 ? (
        <div className='expert-questions'>
          {expertQuestions.map((question, index) => (
            <button
              key={index}
              className='expert-question-button'
              onClick={() => handleExpertQuestionClick(question)}
            >
              {question}
            </button>
          ))}
        </div>
      ) : (
        <div
          className='message-list'
          ref={messageListRef}
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`message-container ${message.sender}`}
            >
              {message.sender === 'ai' && (
                <img
                  src={defaultAIImage}
                  alt='AI'
                  className='profile-image ai'
                />
              )}
              <div className={`message ${message.sender}`}>
                {message.answer ? (
                  <>
                    <ul>
                      {message.answer.map((item, idx) => (
                        <li key={idx}>
                          {item.point}
                          <span
                            className='reference'
                            onClick={() => handleReferenceClick(item.reference)}
                            style={{ cursor: 'pointer' }}
                          >
                            [{idx + 1}]
                          </span>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : message.isFollowUp ? (
                  <>
                    <p>{message.text}</p>
                    <div className='follow-up-questions'>
                      {message.followUpQuestions.map((question, idx) => (
                        <button
                          key={idx}
                          className='follow-up-question-button'
                          onClick={() => handleExpertQuestionClick(question)}
                        >
                          {question}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  message.text
                )}
              </div>
              {message.sender === 'user' && (
                <img
                  src={defaultUserImage}
                  alt='User'
                  className='profile-image'
                />
              )}
            </div>
          ))}
          {isLoading && (
            <div className='message-container ai'>
              <img
                src={defaultAIImage}
                alt='AI'
                className='profile-image'
              />
              <div className='message ai'>
                <LoadingIndicator />
              </div>
            </div>
          )}
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        className='input-form'
      >
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type your message here...'
        />
        <button
          type='submit'
          className='send-button'
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default AIConversation;

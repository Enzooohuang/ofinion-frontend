import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import {
  FaHome,
  FaRobot,
  FaCalendarAlt,
  FaPhone,
  FaFileAlt,
  FaLightbulb,
  FaChartLine,
  FaFilter,
  FaQuestionCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
} from 'react-icons/fa';

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const menuItems = [
    { name: 'Home', path: '/', icon: FaHome },
    { name: 'AI Chat', path: '/ai-chat', icon: FaRobot },
    {
      name: 'Earnings Calendar',
      path: '/earnings-calendar',
      icon: FaCalendarAlt,
    },
    { name: 'Calls & Events', path: '/calls-and-events', icon: FaPhone },
    {
      name: 'Transcripts & Reports',
      path: '/transcripts-and-reports',
      icon: FaFileAlt,
    },
    { name: 'Insights', path: '/insights', icon: FaLightbulb },
    { name: 'Sentiment Hub', path: '/sentiment-hub', icon: FaChartLine },
    { name: 'Screener', path: '/screener', icon: FaFilter },
    { name: 'Help', path: '/help', icon: FaQuestionCircle },
    // Removed Pricing and Disclaimer
  ];

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    transition: 'background-color 0.2s ease-in-out',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  };

  const iconStyle = {
    width: '20px',
    height: '20px',
    minWidth: '20px',
    marginRight: isCollapsed ? '0' : '10px',
    transition: 'margin-right 0.3s ease-in-out',
  };

  const textStyle = {
    opacity: isCollapsed ? 0 : 1,
    transition: 'opacity 0.3s ease-in-out',
    width: isCollapsed ? 0 : 'auto',
    overflow: 'hidden',
  };

  return (
    <div
      style={{
        width: isCollapsed ? '60px' : '300px',
        backgroundColor: 'black',
        color: 'white',
        height: '100vh',
        transition: 'width 0.3s ease-in-out',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            opacity: isCollapsed ? 0 : 1,
            transition: 'opacity 0.3s ease-in-out',
            width: isCollapsed ? 0 : 'auto',
            overflow: 'hidden',
          }}
        >
          Logo
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '30px',
            height: '30px',
          }}
        >
          {isCollapsed ? (
            <FaChevronRight size={20} />
          ) : (
            <FaChevronLeft size={20} />
          )}
        </button>
      </div>
      <nav
        style={{
          marginTop: '2rem',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flexGrow: 1 }}>
          {menuItems.map((item, index) => (
            <li
              key={index}
              style={{ marginBottom: '0.5rem' }}
            >
              <Link
                to={item.path}
                style={linkStyle}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#333')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                <item.icon style={iconStyle} />
                <span style={textStyle}>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* User profile section */}
        <Link
          to='/join'
          style={{
            ...linkStyle,
            marginTop: 'auto',
            marginBottom: '1rem',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = 'transparent')
          }
        >
          <FaUserPlus style={iconStyle} />
          <span style={textStyle}>Join Free</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

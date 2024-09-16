import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import StockDetail from './components/StockDetail';
import EventDetail from './components/EventDetail';
import JoinFree from './components/JoinFree';
import Login from './components/Login';
import axios from 'axios'; // Added import for axios

function App() {
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check for existing user session on app load
    // const checkUserSession = async () => {
    //   try {
    //     const response = await axios.get('http://localhost:8000/api/user/');
    //     if (response.data.user) {
    //       setUser(response.data.user);
    //     }
    //   } catch (error) {
    //     console.error('Error checking user session:', error);
    //   }
    // };
    // checkUserSession();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/user/email-logout/');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <GoogleOAuthProvider clientId='1030657402341-nqqo3nti4geuu29h01g4pr91l20dchqk.apps.googleusercontent.com'>
      <Router>
        <div
          className='App'
          style={{ display: 'flex', height: '100vh' }}
        >
          <Sidebar
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              flexGrow: 1,
              overflow: 'hidden',
              width: isCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 300px)',
              transition: 'width 0.3s ease-in-out',
            }}
          >
            <Header
              user={user}
              onLogout={handleLogout}
            />
            <Routes>
              <Route
                path='/'
                element={<MainContent />}
              />
              <Route
                path='/stock/:symbol'
                element={<StockDetail />}
              />
              <Route
                path='/event'
                element={<EventDetail />}
              />
              <Route
                path='/join'
                element={<JoinFree onLogin={handleLogin} />}
              />
              <Route
                path='/login'
                element={<Login onLogin={handleLogin} />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

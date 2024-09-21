import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Header from './components/Header';
import HeaderMVP from './components/HeaderMVP';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import MainContentMVP from './components/MainContentMVP';
import EventDetail from './components/EventDetail';
import JoinFree from './components/JoinFree';
import Login from './components/Login';
import axios from 'axios';
import { getCsrfTokenFromCookie } from './utils/csrf';
import './global.css'; // Import the global CSS file
import Footer from './components/Footer'; // Add this import

// Create a new axios instance with default config
const axiosInstance = axios.create({
  withCredentials: true,
});

// Add a request interceptor to include CSRF token
axiosInstance.interceptors.request.use(
  function (config) {
    const csrfToken = getCsrfTokenFromCookie();
    if (csrfToken) {
      config.headers['X-CSRFToken'] = csrfToken;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

function App() {
  const [user, setUser] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const response = await axiosInstance.post(
          'http://localhost:8000/api/user/check-session/'
        );
        if (response.data) {
          setUser(response.data);
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post('http://localhost:8000/api/user/email-logout/');
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const useMVP = true;

  return (
    <GoogleOAuthProvider clientId='1030657402341-nqqo3nti4geuu29h01g4pr91l20dchqk.apps.googleusercontent.com'>
      <Router>
        {useMVP ? (
          <div className='App mvp-layout'>
            <HeaderMVP
              user={user}
              onLogout={handleLogout}
            />
            <div style={{ flexGrow: 1, overflow: 'auto' }}>
              {/* Added this wrapper */}
              <Routes>
                <Route
                  path='/'
                  element={<MainContentMVP />}
                />
                <Route
                  path='/stock/:symbol/event'
                  element={<EventDetail />}
                />
                <Route
                  path='/join'
                  element={
                    <JoinFree
                      onLogin={handleLogin}
                      axiosInstance={axiosInstance}
                    />
                  }
                />
                <Route
                  path='/login'
                  element={
                    <Login
                      onLogin={handleLogin}
                      axiosInstance={axiosInstance}
                    />
                  }
                />
              </Routes>
            </div>
            <Footer />
          </div>
        ) : (
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
                overflow: 'auto', // Changed from 'hidden' to 'auto'
                width: isCollapsed ? 'calc(100% - 60px)' : 'calc(100% - 300px)',
                transition: 'width 0.3s ease-in-out',
              }}
            >
              <Header
                user={user}
                onLogout={handleLogout}
              />
              <div style={{ flexGrow: 1, overflow: 'auto' }}>
                {' '}
                {/* Added this wrapper */}
                <Routes>
                  <Route
                    path='/'
                    element={<MainContent />}
                  />
                  <Route
                    path='/stock/:symbol/event'
                    element={<EventDetail />}
                  />
                  <Route
                    path='/join'
                    element={
                      <JoinFree
                        onLogin={handleLogin}
                        axiosInstance={axiosInstance}
                      />
                    }
                  />
                  <Route
                    path='/login'
                    element={
                      <Login
                        onLogin={handleLogin}
                        axiosInstance={axiosInstance}
                      />
                    }
                  />
                </Routes>
              </div>
            </div>
          </div>
        )}
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;

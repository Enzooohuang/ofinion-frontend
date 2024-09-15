import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';

function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
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
          <Header />
          <MainContent />
        </div>
      </div>
    </Router>
  );
}

export default App;

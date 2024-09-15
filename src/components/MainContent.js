import React from 'react';
import { Routes, Route } from 'react-router-dom';
import StockDetail from './StockDetail';
import EventDetail from './EventDetail';

const MainContent = () => {
  return (
    <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
      <Routes>
        <Route
          path='/stock/:symbol'
          element={<StockDetail />}
        />
        <Route
          path='/stock/:symbol/event'
          element={<EventDetail />}
        />
        <Route
          path='*'
          element={<div>404 - Not Found</div>}
        />
      </Routes>
    </div>
  );
};

export default MainContent;

import React from 'react';
import Box1 from './Box1';
import DisplayImage from './DisplayImage';
import Box3 from './Box3';
import Box4 from './Box4';
import Box5 from './Box5';
import Box6 from './Box6';
import BottomBox from './BottomBox';

const MainContentMVP = () => {
  return (
    <div className='main-content-mvp'>
      <Box1 />
      <DisplayImage />
      <Box3 />
      <Box4 />
      <Box5 />
      <Box6 />
      <BottomBox />
    </div>
  );
};

export default MainContentMVP;

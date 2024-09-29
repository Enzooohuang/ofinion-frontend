import React from 'react';
import Box1 from './Box1';
import DisplayImage from './DisplayImage';
import Box3 from './Box3';
import Box4 from './Box4';
import SearchBoxSection from './SearchBoxSection';
import Box6 from './Box6';
import BottomBox from './BottomBox';

const MainContentMVP = ({ axiosInstance, baseUrl }) => {
  return (
    <div className='main-content-mvp'>
      <Box1 />
      <DisplayImage />
      <Box3
        axiosInstance={axiosInstance}
        baseUrl={baseUrl}
      />
      <Box4 />
      <SearchBoxSection
        axiosInstance={axiosInstance}
        baseUrl={baseUrl}
      />
      <Box6 />
      <BottomBox />
    </div>
  );
};

export default MainContentMVP;

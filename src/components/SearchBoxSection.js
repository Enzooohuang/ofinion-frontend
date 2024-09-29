import React from 'react';
import './css/SearchBoxSection.css';
import SearchBox from './SearchBox';

const SearchBoxSection = ({ axiosInstance, baseUrl }) => {
  return (
    <div className='box box5'>
      <h1 className='box5-title'>Check yourself ~</h1>
      <SearchBox
        axiosInstance={axiosInstance}
        baseUrl={baseUrl}
      />
    </div>
  );
};

export default SearchBoxSection;

import React from 'react';

const SearchBox = ({searchfield, searchChange, style}) => {
  return (
      <input
        className= 'pa3 ba'
        style={style}
        type='search'
        placeholder='Search'
        value={searchfield}
        onChange={searchChange}/>
  );
}

export default SearchBox;

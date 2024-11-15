import React, { useState } from 'react';
import { LuSearch } from 'react-icons/lu';
import { debounce } from '@/utils';

import { SearchIcon, SearchWrapper, StyledInput } from './index.style';

interface CustomSearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
}

const CustomSearchInput: React.FC<CustomSearchInputProps> = ({
  placeholder = 'Search...',
  onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    handleSearch(e);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    debounce(onSearch, 1000)(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  return (
    <SearchWrapper>
      <SearchIcon>
        <LuSearch />
      </SearchIcon>
      <StyledInput
        type="text"
        placeholder="Search tokens"
        onKeyPress={handleKeyPress}
        onChange={handleInputChange}
      />
    </SearchWrapper>
  );
};

export default CustomSearchInput;

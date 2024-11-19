import React, { useState } from 'react';
import { Box } from '@chakra-ui/react';
import { FaChevronDown } from 'react-icons/fa6';

import {
  OptionItem,
  OptionsList,
  SelectWrapper,
  StyledSelect,
} from './index.style';

interface Option {
  label: string;
  value: string;
}

interface CustomSelectProps {
  options: Option[];
  onChange: (option: Option) => void;
}

const CustomSelect = ({ options, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);

  const handleOptionClick = (option: Option): void => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  return (
    <SelectWrapper>
      <StyledSelect onClick={() => setIsOpen(!isOpen)}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box>
            <span>sort: </span>
            {selectedOption.label}
          </Box>
          <FaChevronDown color="#BEBDBA" />
        </Box>
      </StyledSelect>
      {isOpen && (
        <OptionsList>
          {options.map((option: Option, index: number) => (
            <OptionItem
              key={index}
              onClick={() => handleOptionClick(option)}
              isSelected={selectedOption.value === option.value}
            >
              {option.label}
            </OptionItem>
          ))}
        </OptionsList>
      )}
    </SelectWrapper>
  );
};

export default CustomSelect;

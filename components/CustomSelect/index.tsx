import React, { useState } from 'react';
import { Box, useOutsideClick } from '@chakra-ui/react';
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
  key: string;
}

interface CustomSelectProps {
  prefix?: string;
  options: Option[];
  onChange: (option: Option) => void;
}

const CustomSelect = ({ prefix, options, onChange }: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const ref = React.useRef<HTMLDivElement | null>(null);

  useOutsideClick({
    ref: ref,
    handler: () => setIsOpen(false),
  });

  const handleOptionClick = (option: Option): void => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option);
  };

  return (
    <SelectWrapper ref={ref}>
      <StyledSelect onClick={() => setIsOpen(!isOpen)}>
        <Box
          display={'flex'}
          alignItems={'center'}
          justifyContent={'space-between'}
        >
          <Box>
            {prefix && <span>{prefix}: </span>}
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
              isSelected={selectedOption.key === option.key}
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

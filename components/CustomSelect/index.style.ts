import styled from '@emotion/styled';

export const SelectWrapper = styled('div')`
  position: relative;
  display: inline-block;
  font-family: Arial, sans-serif;
`;

interface StyledSelectProps {
  width?: string;
}

export const StyledSelect = styled.div<StyledSelectProps>`
  appearance: none;
  background: transparent;
  color: #faf7ed;
  border: 2px solid #3a3a38;
  border-radius: 20px;
  padding: 10px 20px;
  font-size: 16px;
  line-height: 20px;
  font-weight: 300;
  cursor: pointer;
  width: ${(props) => props?.width || '240px'};
  box-sizing: border-box;
  position: relative;

  span {
    color: #bebdba;
  }

  @media (max-width: 768px) {
    width: 300px;
  }
`;

export const OptionsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  position: absolute;
  width: 100%;
  background: #121212;
  border: 2px solid #3a3a38;
  border-radius: 20px;
  z-index: 1;

  & > :first-of-type {
    border-radius: 15px 15px 0 0;
  }

  & > :last-of-type {
    border-radius: 0 0 15px 15px;
  }
`;

export const OptionItem = styled.li<{ isSelected: boolean }>`
  padding: 8px 20px;
  cursor: pointer;
  background: ${({ isSelected }) => (isSelected ? '#3a3a38' : 'transparent')};

  &:hover {
    background: #3a3a38;
  }
`;

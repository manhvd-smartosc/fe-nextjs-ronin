import styled from '@emotion/styled';

export const SearchWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  background: transparent;
  border: 2px solid #3A3A38;
  border-radius: 20px;
  padding: 8px 15px;
  width: 300px;
`;

export const SearchIcon = styled.div`
  position: absolute;
  left: 15px;
  font-size: 16px;
  color: #ffffff;
  pointer-events: none;
`;

export const StyledInput = styled.input`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  color: #aaaaaa;
  padding-left: 30px;
  font-size: 16px;

  ::placeholder {
    color: #aaaaaa;
  }
`;

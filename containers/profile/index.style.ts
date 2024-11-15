import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledProfilePage = styled(Box)`
  background-color: #1a1a1a;
  position: relative;
  margin-top: 76px;

  .edit-button {
    background-color: #1a1a1a;
    height: 36px;
    padding: 8px 11px 8px 11px;
    gap: 10px;
    border-radius: 40px;
    opacity: 0px;
    border: 1px solid #dadada;
    font-weight: 500;
    line-height: 20px;
    color: #faf7ed;
    z-index: 100;

    &:hover {
      background-color: #2f2f2f;
    }
  }
`;

export { StyledProfilePage };

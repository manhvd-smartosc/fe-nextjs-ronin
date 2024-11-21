import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledCoinCreatedContainer = styled(Box)`
  .image {
    border-radius: 10px;
    height: auto;
    width: 124px;
    object-fit: cover;
    margin-right: 4px;
    align-self: flex-start;

    @media (max-width: 768px) {
      width: 120px;
      object-fit: contain;
      margin-bottom: 16px;
    }
  }
`;

export { StyledCoinCreatedContainer };

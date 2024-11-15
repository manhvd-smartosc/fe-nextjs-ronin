import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledTokenContainer = styled(Box)`
  background-color: gray.800;
  color: white;
  border-radius: 24px;
  padding: 16px;
  box-shadow: inset 0px -2px 1px 1px #ac65f3, inset 0px -2px 3px #ffffff;
  box-sizing: border-box;
  backdrop-filter: blur(20px);

  .image {
    border-radius: 24px;
    height: 160px;
    width: 160px;
    object-fit: cover;
    margin-right: 4px;
  }

  .get-start-btn {
    width: 168px;
    height: 52px;
    padding: 12px 24px;
    opacity: 1;
    background: #ac65f3;
    font-size: 18px;
    font-weight: 700;
    box-shadow: 0px -2px 4px 3px #6f1ec0 inset;
    border-image-slice: 1;
    border-radius: 999px;
    border: 2px solid #00000094;
  }
`;

export { StyledTokenContainer };

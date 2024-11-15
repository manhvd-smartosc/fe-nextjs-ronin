import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledBackgroundCover = styled(Box)`
  position: relative;

  .text-container {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;
  }

  .get-start-btn {
    width: 168px;
    height: 52px;
    padding: 12px 24px;
    opacity: 1;
    background: #ac65f3;
    font-size: 18px;
    font-weight: 700;
    border-image-slice: 1;
    border-radius: 40px;
    border: 2px solid #00000094;
    box-sizing: border-box;
    border: 2px solid;
    border-image-source: linear-gradient(
      180deg,
      #2f2b27 0%,
      rgba(248, 233, 214, 0.9) 100%
    );
    box-shadow: 0px -2px 4px 3px #6f1ec0 inset;
  }
`;

export { StyledBackgroundCover };

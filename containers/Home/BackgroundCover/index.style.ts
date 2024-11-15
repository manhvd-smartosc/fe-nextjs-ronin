import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledBackgroundCover = styled(Box)`
  position: relative;

  .image {
    width: 100%;
    height: 320px;
    background-size: cover;
    z-index: 1;
    margin-top: 56px;

    @media (min-width: 1540px) {
      height: auto;
    }
  }

  .text-container {
    position: absolute;
    top: 60%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    text-align: center;

    @media (max-width: 768px) {
      top: 75%;
    }

    @media (max-width: 1280px) {
      height: auto;
    }
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
    border-image-source: linear-gradient(
      180deg,
      #2f2b27 0%,
      rgba(248, 233, 214, 0.9) 100%
    );
    box-shadow: 0px -2px 4px 3px #6f1ec0 inset;

    &:hover {
      background: #9248e0;
      box-shadow: 0px -2px 4px 3px #5a1a9e inset;
    }
  }
`;

export { StyledBackgroundCover };

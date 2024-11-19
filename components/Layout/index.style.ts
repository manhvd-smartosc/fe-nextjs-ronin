import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { THEME_COLOR } from '@/constants/color';

const StyledHeader = styled(Box)`
  background-color: ${THEME_COLOR.headerBg};
  color: ${THEME_COLOR.text};
  text-align: center;
  margin: 0 auto; /* Center the header */
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 10px 40px;

  .site-image {
    height: 40px;
    width: 40px;
    margin-left: 10px;
  }

  .site-link-container {
    margin-left: 16px;
    align-items: center;
    gap: 16px;

    .site-link {
      cursor: pointer;
      color: #f0f6ff;
      font-size: 12px;
      font-weight: 400;
      line-height: 16px;

      &:hover {
        color: ${THEME_COLOR.primary};
        text-decoration: underline;
      }
    }
  }

  .transaction-container {
    align-items: center;
    border: 2px dashed #ac65f3;
    border-radius: 40px;
    padding: 2px;
    background-color: black;
    color: white;
    overflow: hidden;
    position: relative;
    height: 50px;
    margin-left: auto;
  }

  .connect-btn-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 170px;
    cursor: pointer;

    .connect-btn {
      font-size: 14px;
      color: white;
      position: absolute;
      z-index: 1;
    }
  }
`;

export { StyledHeader };

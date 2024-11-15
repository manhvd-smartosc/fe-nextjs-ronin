import styled from '@emotion/styled';
import { THEME_COLOR } from '@/constants/color';
import { Box } from '@chakra-ui/react';

const StyledHeader = styled('div')`
  background-color: ${THEME_COLOR.headerBg};
  color: ${THEME_COLOR.text};
  text-align: center;
  margin: 0 auto; /* Center the header */
  min-height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  padding: 10px 40px;

  @media (max-width: 768px) {
    padding: 8px;
  }

  .site-image {
    height: 40px;
    width: 40px;
    margin-left: 10px;
    cursor: pointer;
  }

  .site-link-container {
    margin-left: 16px;
    align-items: center;
    gap: 16px;

    .site-link {
      cursor: pointer;
      color: #f0f6ff;
      font-weight: 400;
      line-height: 16px;
      @media (max-width: 768px) {
        border-bottom: 1px solid ${THEME_COLOR.primary};
      }
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
  }

  .connect-btn-container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 170px;
    cursor: pointer;

    .connect-btn {
      position: absolute;
      z-index: 1;
    }
  }
`;

const StyledAddressInfoBtn = styled('div')`
  padding: 8px 0;
  .address-info-btn {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    min-width: 129px;
    height: 40px;
    border: 1px solid #ac65f3;
    border-radius: 60px;
    margin-left: 10px;
    transition: background-color 0.3s, color 0.3s;
    gap: 6px;

    &:hover {
      color: white;
      background: transparent;
    }
  }

  .chakra-popover__content {
    position: absolute;
    right: 0;
    box-sizing: border-box;
    background: #1a1a1a;
    box-shadow: 0px 24px 64px 4px rgba(0, 0, 0, 0.5);
    border-radius: 16px;
    border: 1px solid #1a1a1a;
    padding: 8px;
  }

  .logout-btn {
    padding: 5px 16px;
    background: #ac65f3;
    width: 84px;
    height: 32px;
  }

  .view-profile {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #ac65f3;
  }
`;

const StyledFooter = styled(Box)`
  background-color: ${THEME_COLOR.headerBg};
  color: ${THEME_COLOR.text};
  text-align: center;
  padding: 1.5rem 2rem;
  margin-top: auto;
  min-height: 56px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    padding: 5px;
    gap: 5px;
  }
`;

export { StyledHeader, StyledAddressInfoBtn, StyledFooter };

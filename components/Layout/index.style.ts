import styled from '@emotion/styled';
import { THEME_COLOR } from '@/constants/color';

const StyledHeader = styled('div')`
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
      font-size: 14px;
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

const StyledAddressInfoBtn = styled('div')`
  padding: 8px 0;
  .address-info-btn {
    box-sizing: border-box;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 129px;
    height: 40px;
    border: 1px solid #ac65f3;
    border-radius: 60px;
    margin-left: 10px;
    transition: background-color 0.3s, color 0.3s;
    gap: 6px;

    &:hover {
      background-color: #ac65f3;
      color: black;
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
    width: 105px;
    height: 32px;
    background: #ac65f3;
    border-radius: 40px;
  }

  .view-profile {
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    color: #ac65f3;
  }
`;

export { StyledHeader, StyledAddressInfoBtn };

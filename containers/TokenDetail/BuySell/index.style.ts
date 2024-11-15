import { Box, TabList } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledTabContainer = styled(Box)`
  display: flex;
  flex-direction: column;

  .address {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    padding: 10px 10px;
    gap: 8px;
    border-radius: 40px;
    opacity: 0px;
    background-color: #302e2c;
    box-shadow: 0px -2px 0px 0px #bfc3b826 inset;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
    letter: -0.5%;
    color: #faf7ed;
  }

  .ticker-info {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    padding: 24px 60px;
    gap: 30px;
    border-radius: 16px;
    opacity: 0px;
    background-color: #1a1a1a;
    box-shadow: 0px 40px 32px -24px #0f0f0f1f;

    .social-link {
      width: 33%;
      padding: 6px 12px;
      gap: 8px;
      border-radius: 40px;
      opacity: 0px;
      background-color: #302e2c;
      box-shadow: 0px -2px 0px 0px #bfc3b826 inset;
      display: flex;
      justify-content: center;
    }
  }

  .bonding-curve {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
    gap: 16px;
    border-radius: 16px;
    opacity: 0px;
    background-color: #1a1a1a;
    box-shadow: 0px 40px 32px -24px #0f0f0f1f;
  }

  .holder-distribute {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    padding: 16px 20px;
    gap: 16px;
    border-radius: 16px;
    opacity: 0px;
    background-color: #1a1a1a;
    box-shadow: 0px 40px 32px -24px #0f0f0f1f;

    .generate-bubble-map-button {
      height: 26px;
      padding: 3px 8px 3px 8px;
      gap: 6px;
      border-radius: 40px;
      opacity: 0px;
      background-color: #302e2c;
      border: 1px solid #6b6b69;
    }
  }
`;

const StyledTabList = styled(TabList)`
  height: 50px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  padding: 4px;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  color: #8a8986;
  border: 1px solid #6b6b69;
  border-radius: 40px;
  background-color: #302e2c;

  .chakra-tabs__tab {
    width: 50%;
    margin: 0;
    border-radius: 40px;
    border: none;
    background-color: transparent;
    cursor: pointer;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const StyledFormWrapper = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
  width: 100%;

  .slippage-button {
    display: flex;
    justify-content: flex-end;
    height: 26px;
    padding: 3px 8px 3px 8px;
    gap: 6px;
    border-radius: 40px;
    border: 1px solid #6b6b69;
    background-color: #302e2c;
    text-align: center;
    opacity: 0px;
    font-weight: 500;

    &:hover {
      background-color: #3a3a38;
    }
  }

  .input-wrapper {
    display: flex;
    height: 52px;
    padding: 0 16px;
    gap: 4px;
    border-radius: 12px;
    border: 2px solid #6b6b69;
  }

  .input-amount {
    color: #faf7ed;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
  }

  .label {
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    align-items: center;
    color: #faf7ed;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    width: 200px;
    max-width: 300px;
  }

  .option-wrapper {
    display: flex;
    gap: 4px;

    button {
      width: 70px;
      height: 32px;
      padding: 6px 12px 6px 12px;
      gap: 8px;
      border-radius: 6px;
      opacity: 0px;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #242424;
      font-size: 14px;
      font-weight: 500;
      text-align: center;

      &:hover {
        background-color: #302e2c;
      }
    }
  }

  .submit-button {
    margin-top: 10px;
    width: 100%;
    height: 46px;
    padding: 10px 28px 10px 28px;
    gap: 8px;
    border-radius: 60px;
    opacity: 0px;
    background: #ac65f3;
    color: #faf7ed;
    font-weight: 700;
    line-height: 22px;
    font-size: 16px;
    font-weight: 700;
    box-shadow: 0px -2px 4px 3px #6f1ec0 inset;

    &:hover {
      background: #8a3cd2;
    }
  }
`;

const StyledSlippageContentModal = styled(Box)`
  max-width: 452px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  .input-wrapper {
    display: flex;
    justify-content: space-between;
    height: 52px;
    padding: 0 16px;
    gap: 4px;
    border-radius: 12px;
    border: 2px solid #6b6b69;
  }

  .input-amount {
    width: 1000px;
    color: #faf7ed;
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
  }

  .label {
    margin-bottom: 6px;
    color: #faf7ed;
    font-size: 14px;
    font-weight: 500;
    line-height: 20px;

    &.required:after {
      content: ' *';
      font-size: 14px;
      color: #ff0000;
    }
  }

  .disclamer {
    margin-top: 6px;
    color: #bebdba;
    font-size: 14px;
    font-weight: 400;
    line-height: 20px;
  }

  .label-image {
    display: flex;
    gap: 8px;
    justify-content: start;
    align-items: center;
    color: #faf7ed;
    font-size: 16px;
    font-weight: 500;
    line-height: 22px;
    margin-right: 20px;
  }
`;

const StyledAddCommentModal = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 0px;
  height: 220px;

  .input {
    padding: 13px 16px;
    height: 172px;
    border: 2px solid #6b6b69;
    border-radius: 12px;
  }

  .label {
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.005em;
    margin-bottom: 8px;
    display: flex;
    gap: 3px;
    font-size: 14px;
  }
`;

export {
  StyledTabContainer,
  StyledTabList,
  StyledFormWrapper,
  StyledSlippageContentModal,
  StyledAddCommentModal,
};

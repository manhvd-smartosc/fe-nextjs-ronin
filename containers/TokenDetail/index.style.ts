import { Box, Table } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledTokenPage = styled(Box)`
  background-color: #1a1a1a;
  position: relative;
  margin-top: 76px;
  padding: 30px 40px;
  width: 100%;

  &.mobile {
    padding: 0;

    .header {
      padding: 15px 20px 0 20px;
      margin-bottom: 0;
    }
  }

  .header {
    color: #faf7ed;
    font-size: 20px;
    font-weight: 700;
    display: flex;
    gap: 16px;
    align-items: center;
    margin-bottom: 20px;

    .back-button {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #6b6b69;
      border-radius: 50%;
      color: #faf7ed;
      font-size: 24px;

      .chakra-button__icon {
        margin: 0;
      }
    }
  }

  .token-detail-wrap {
    padding-bottom: 40px;
    display: flex;
    gap: 40px;

    .chart-comments-section {
      .sumary-section {
        display: flex;
        gap: 20px;
        justify-content: start;
        align-items: center;

        .user-info {
          display: flex;
          justify-content: center;
          gap: 8px;
          align-items: center;
          background-color: #302e2c;
          border-radius: 20px;
          padding: 3px 8px;
        }
      }

      width: calc(100% - 400px);

      .chart-section {
        margin-top: 20px;
        height: 512px;
        margin-bottom: 20px;
      }

      .comments-section {
        .tab-list {
          border-bottom: 1px solid #373738;
          display: flex;
          gap: 20px;
        }

        .tab-list-button {
          padding: 8px 0px;
          font-size: 16px;
          font-weight: 500;
          line-height: 22px;
          color: #8a8986;
          border-bottom: 3px solid transparent;
        }
      }
    }

    .sell-buy-section {
      width: 400px;

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
    }
  }
`;

const StyledTokenMobileWrapper = styled(Box)`
  min-height: 100vh;
  height: fit-content;
  position: relative;

  .tab-list-mobile {
    width: 100%;
    bottom: 0;
    padding: 10px 10px;
    height: 60px;
    background: #1a1a1a;
    border-top: 0.3px solid #6b6b69;
    display: flex;
    justify-content: space-around;
    transition: 0.5s;
  }

  .tab-list-button {
    width: 69px;
    height: 32px;
    padding: 8px 24px 8px 24px;
    gap: 4px;
    border-radius: 8px;
    border: 2px 0px 0px 0px;
    background: #faf7ed1a;
    opacity: 0px;
    font-size: 12px;
    font-weight: 500;
    line-height: 16px;
    color: #8a8986;
  }

  .address {
    margin-bottom: 30px;
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
    color: #faf7ed;
  }

  .ticker-info {
    /* margin-top: 20px; */
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

  .chart-section {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

const StyledTradesTable = styled(Table)`
  background-color: #171717;
  border-radius: 12px;

  .table-header {
    height: 40px;
    gap: 0px;
    background-color: #242424;
    border-bottom: 1px solid #373738;
    border-radius: 12px 12px 0px 0px;

    tr {
      border-radius: 12px 12px 0px 0px;
      th {
        padding: 12px 24px 12px 24px;
        opacity: 0px;
        font-size: 12px;
        font-weight: 700;
        line-height: 16px;
        color: #bebdba;
        border: none;
      }
    }
  }

  .table-body {
    tr {
      height: 50px;
      border-bottom: 1px solid #373738;
      td {
        padding: 8px 24px 8px 24px;
        gap: 8px;
        opacity: 0px;
        font-size: 16px;
        font-weight: 400;
        line-height: 22px;
        color: #faf7ed;
        border: none;
      }
      &:last-child {
        border-bottom: none;
      }
    }
  }
`;

const StyledDiscussionSection = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const StyledDiscussionThread = styled(Box)`
  background-color: #171717;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  border-radius: 16px;
`;

const StyledCommentPopup = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .chakra-modal__body {
    background-color: #0a0a0a;
  }

  .input-wrapper {
    display: flex;
    justify-content: space-between;
    height: 120px;
    padding: 14px 16px 14px 16px;
    gap: 4px;
    border-radius: 12px;
    border: 2px solid #6b6b69;
  }

  .label {
    margin-bottom: 8px;
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
`;

export {
  StyledTokenPage,
  StyledTokenMobileWrapper,
  StyledTradesTable,
  StyledDiscussionSection,
  StyledDiscussionThread,
  StyledCommentPopup,
};

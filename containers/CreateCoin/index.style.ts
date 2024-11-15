import { Box } from '@chakra-ui/react';
import styled from '@emotion/styled';
import BackgroundCreateCoin from '@/assets/images/background-create-coin.png';

const StyledCreateCoinContainer = styled(Box)`
  margin-top: 76px;
  background-image: url(${BackgroundCreateCoin.src});
  background-size: cover;
  background-repeat: no-repeat;

  .content {
    width: 828px;
    padding: 50px;
    margin: 0 auto;
    min-height: calc(100vh - 56px - 56px);

    @media (max-width: 768px) {
      width: auto;
      padding: 20px;
    }
  }

  .create-coin-form-container {
    margin-top: 10px;
    padding: 30px 24px 0;
    gap: 60px;
    width: 828px;
    background: #1a1a1a;
    box-shadow: inset 0px -2px 1px 1px #ac65f3, inset 0px -2px 3px #ffffff;
    backdrop-filter: blur(20px);
    border-radius: 24px;
    @media (max-width: 768px) {
      width: auto;
    }
  }

  .upload-container {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 32px 16px;
    gap: 5px;
    width: 270px;
    height: 270px;
    border: 2px dashed #6b6b69;
    border-radius: 16px;
    flex: none;
    order: 0;
    flex-grow: 0;

    @media (max-width: 768px) {
      width: auto;
      height: 200px;
    }

    .drap-and-drop {
      font-weight: 500;
      font-size: 16px;
      line-height: 22px;
      text-align: center;
      letter-spacing: -0.01em;
      color: #faf7ed;
    }

    .max-size-text {
      height: 16px;
      font-style: normal;
      font-weight: 400;
      font-size: 12px;
      line-height: 16px;
      display: flex;
      align-items: center;
      letter-spacing: -0.005em;
      color: #8a8986;
    }

    .upload-btn {
      padding: 10px 12px;
      width: 150px;
      height: 40px;
      border: 2px solid #ac65f3;
      border-radius: 256px;
      background-color: transparent;
      color: white;
      margin-top: 50px;

      @media (max-width: 768px) {
        margin-top: 20px;
      }
    }
  }

  .form-container {
    flex: 1;
    .label {
      font-weight: 500;
      line-height: 20px;
      letter-spacing: -0.005em;
      margin-bottom: 8px;
      display: flex;
      gap: 3px;
    }
    .input {
      padding: 13px 16px;
      height: 48px;
      border: 2px solid #6b6b69;
      border-radius: 12px;
    }
    .social {
      display: flex;
      padding: 12px;
      width: 450px;
      height: 48px;
      border: 2px solid #6b6b69;
      border-radius: 12px;
      color: #8a8986;
    }

    .input-group {
      border: 2px solid #6b6b69;
      border-radius: 12px;
      height: 48px;
    }
  }
  .create-coin-btn {
    width: 168px;
    height: 52px;
    box-shadow: inset 0px -2px 4px 3px #6f1ec0;
    &:hover {
      background: #ac65f3;
      color: white;
    }
  }
`;

export { StyledCreateCoinContainer };

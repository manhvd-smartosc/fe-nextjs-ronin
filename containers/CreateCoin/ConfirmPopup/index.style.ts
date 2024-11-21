import { ModalContent } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledModalContent = styled(ModalContent)`
  width: 500px;
  background: #1a1a1a;
  border: 2px solid #6b6b69;
  border-radius: 24px;

  .chakra-modal__close-btn {
    color: #bebdba;
  }

  .chakra-modal__header {
    font-family: 'Helvetica Neue';
    font-style: normal;
    font-weight: 700;
    font-size: 20px;
    line-height: 28px;
    text-align: center;
    letter-spacing: -0.01em;
    color: #faf7ed;
    margin-top: 20px;
  }

  .quantity-container {
    background: #0a0a0a;
    border-radius: 24px;
    padding: 20px;
  }

  .label {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: -0.005em;
    color: #faf7ed;
    display: flex;
    justify-content: flex-end;
    margin-bottom: 10px;
  }

  .input-group {
    border: 2px solid #6b6b69;
    border-radius: 12px;
    height: 48px;
    color: white;
  }

  .note {
    margin-top: 30px;
    width: 404px;
    height: 40px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    letter-spacing: -0.005em;
    color: #bebdba;
  }

  .create-coin-btn {
    width: 100%;
    height: 52px;
    background: #ac65f3;
    box-shadow: inset 0px -2px 4px 3px #6f1ec0;
    border-radius: 40px;
    color: white;
    &:hover {
      background: #ac65f3;
      color: white;
    }
  }
`;

export { StyledModalContent };
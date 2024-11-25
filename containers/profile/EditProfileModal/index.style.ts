import { Box, ModalContent, ModalHeader } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledModalContent = styled(ModalContent)`
  position: relative;
  width: 484px;
  // height: 570px;
  padding: 0px 16px 24px 16px;
  gap: 24px;
  border-radius: 24px;
  border: 2px solid transparent;
  opacity: 0;
  background: #1a1a1a;
  border: 2px solid #6b6b69;
  color: #faf7ed;

  @media (max-width: 768px) {
    margin: 5px;
  }

  .close-button {
    background-color: #bebdba;
    width: 25px;
    height: 25px;
    border-radius: 50%;
  }

  .image-wrap-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
  }

  .image-preview {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }

  .upload-button {
    height: 32px;
    padding: 6px 12px;
    gap: 8px;
    border-radius: 16px;
    opacity: 0px;
    background: #302e2c;
    color: #faf7ed;
    font-weight: 700;
    line-height: 20px;
    backdrop-filter: blur(118.8px);
    box-shadow: 0px -2px 0px 0px #bfc3b826 inset;
  }

  .form-label {
    font-weight: 500;
    line-height: 20px;
    color: #faf7ed;
  }

  .input-wrap {
    min-height: 48px;
    padding: 13px 16px 13px 16px;
    gap: 10px;
    border-radius: 12px;
    border: 2px solid #6b6b69;
    opacity: 0px;
    display: flex;
    align-items: center;
  }

  .save-button {
    width: 100%;
    height: 52px;
    padding: 12px 32px 12px 32px;
    gap: 8px;
    border-radius: 60px;
    opacity: 0px;
    background: #ac65f3;
    color: #faf7ed;
    font-weight: 500;
    line-height: 20px;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    box-shadow: 0px -2px 4px 3px #6f1ec0 inset;
  }
`;

const StyledModalHeader = styled(Box)`
  position: absolute;
  width: 190px;
  height: 52px;
  padding: 10px 40px 14px 40px;
  gap: 10px;
  border-radius: 16px;
  background: #1a1a1a;
  border: 1px solid;
  color: #faf7ed;
  font-size: 20px;
  font-weight: 700;
  line-height: 28px;
  display: flex;
  justify-content: center;
  right: 50%;
  transform: translateX(50%);
  top: -5%;
  box-shadow: 0px -2px 4px 2px #ffffff33 inset, 0px 2px 1px 2px #ffffff1a;
  border: 1px solid rgba(248, 233, 214, 0.9);
`;

export { StyledModalContent, StyledModalHeader };

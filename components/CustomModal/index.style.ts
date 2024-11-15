import { Box, ModalContent, ModalHeader } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledModalContent = styled(ModalContent)`
  position: relative;
  max-width: 484px;
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
    padding: 0px 12px 12px 12px;
    gap: 12px;
  }

  .close-button {
    background-color: #bebdba;
    width: 25px;
    height: 25px;
    border-radius: 50%;
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

    &:hover {
      background: #8a3cd2;
    }

    &:disabled {
      background: #ac65f3;
    }
  }

  .cancel-button {
    width: 100%;
    height: 52px;
    padding: 12px 32px 12px 32px;
    gap: 8px;
    border-radius: 60px;
    opacity: 0px;
    background: #1a1a1a;
    color: #faf7ed;
    font-weight: 500;
    line-height: 20px;
    font-size: 18px;
    font-weight: 700;
    line-height: 24px;
    box-shadow: 0px -2px 2px 3px #ffffff1f inset;
  }
`;

const StyledModalHeader = styled(Box)`
  position: absolute;
  min-width: 190px;
  align-items: center;
  height: 52px;
  padding: 10px 10px 10px 10px;
  margin: auto;
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
  top: -26px;
  box-shadow: 0px -2px 4px 2px #ffffff33 inset, 0px 2px 1px 2px #ffffff1a;
  border: 1px solid rgba(248, 233, 214, 0.9);

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 8px 16px;
  }
`;

export { StyledModalContent, StyledModalHeader };

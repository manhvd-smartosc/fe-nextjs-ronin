import { ModalContent, Button } from '@chakra-ui/react';
import styled from '@emotion/styled';

const StyledConnectWalletBtnContainer = styled('div')`
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
`;

const StyledConnectWalletModal = styled(ModalContent)`
  border: 2px solid #ac65f3;
  background: #1a1a1a;
  color: #f0f6ff;
  margin: auto;
`;

const StyledWalletOption = styled('div')<{
  disabled: boolean;
}>`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  justify-content: center;
  background-color: #93b0ec1a;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
  padding: 8px 16px;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};
  width: 192px;
  height: 192px;

  &:hover {
    background-color: #93b0ec33;
  }

  p {
    font-size: 16px;
  }
`;

const StyledQRContainer = styled('div')`
  margin: auto;
  background-color: #e2e4e9;
  padding: 8px;
  border-radius: 8px;
`;

const StyledLoadingContainer = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
  weight: 100%;

  div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ModalBackButton = styled('div')`
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  width: 32px;
  height: 32px;
  top: 12px;
  left: 12px;
`;

const ModalOpenAppButton = styled(Button)`
  margin-top: 10px;
  cursor: pointer;
  width: 100%;
  height: 52px;
  border-radius: 60px;
  box-shadow: inset 0px -2px 4px 3px #6f1ec0;
  &:hover {
    background: #ac65f3;
    color: white;
  }
`;

export {
  StyledConnectWalletBtnContainer,
  StyledConnectWalletModal,
  StyledWalletOption,
  StyledQRContainer,
  StyledLoadingContainer,
  ModalBackButton,
  ModalOpenAppButton,
};

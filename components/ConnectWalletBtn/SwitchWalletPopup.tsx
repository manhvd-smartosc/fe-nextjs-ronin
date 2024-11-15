'use client';

import React from 'react';

import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import {
  StyledConnectWalletModal,
  StyledLoadingContainer,
} from './index.style';

interface ConnectWalletPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const SwitchWalletPopup: React.FC<ConnectWalletPopupProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <StyledConnectWalletModal>
        <ModalHeader>
          <Text>Switching Wallet</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody display={'flex'} flexDirection={'row'} gap={2}>
          <StyledLoadingContainer>
            <Box height={208} width={208}>
              <Spinner
                color="purple.500"
                transitionDuration="0.8s"
                size={'xl'}
              />
            </Box>
            <Text textAlign={'center'} fontSize={'md'}>
              Your mobile wallet has switched to another wallet. Switching...
            </Text>
          </StyledLoadingContainer>
        </ModalBody>
        <ModalFooter />
      </StyledConnectWalletModal>
    </Modal>
  );
};

export default SwitchWalletPopup;

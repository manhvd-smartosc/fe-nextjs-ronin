import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
} from '@chakra-ui/react';

import { StyledModalContent, StyledModalHeader } from './index.style';

interface CustomModalProps {
  headTitle: string;
  modalContentStyle?: React.CSSProperties;
  cfButtonLabel?: string;
  closeButtonLabel?: string;
  isOpen: boolean;
  onOpen?: () => void;
  onClose: () => void;
  onConfirm?: () => void;
  bodyBg?: string;
  isHasCloseButton?: boolean;
  isDisabledSaveButton?: boolean;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({
  headTitle,
  modalContentStyle,
  cfButtonLabel,
  closeButtonLabel,
  isOpen,
  onClose,
  onOpen,
  onConfirm,
  children,
  bodyBg = '#1a1a1a',
  isHasCloseButton = true,
  isDisabledSaveButton = false,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <StyledModalContent style={modalContentStyle}>
          <StyledModalHeader>{headTitle}</StyledModalHeader>
          {isHasCloseButton && (
            <ModalCloseButton className="close-button" onClick={onClose} />
          )}
          <ModalBody
            padding={'24px'}
            borderRadius={'24px'}
            marginTop={12}
            backgroundColor={bodyBg}
          >
            {children}
          </ModalBody>
          <ModalFooter p={0} display={'flex'} justifyContent={'center'} gap={3}>
            {!!closeButtonLabel && (
              <Button className="cancel-button" onClick={onClose}>
                {closeButtonLabel}
              </Button>
            )}
            {!!cfButtonLabel && (
              <Button
                className="save-button"
                onClick={onConfirm}
                disabled={isDisabledSaveButton}
              >
                {cfButtonLabel}
              </Button>
            )}
          </ModalFooter>
        </StyledModalContent>
      </Modal>
    </>
  );
};

export default CustomModal;

import {
  Box,
  Button,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import RonIcon from '@/assets/icons/ron.png';
import { estimateTokensByRon } from '@/contract/integration';

import { StyledModalContent } from './index.style';

interface ConfirmPopupProps {
  loading: boolean;
  ticker: string;
  isOpen: boolean;
  onClose: () => void;
  initAmount: string;
  onChangeInitAmount: (amount: string) => void;
  onCreateToken: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  loading,
  ticker,
  isOpen,
  onClose,
  initAmount,
  onChangeInitAmount,
  onCreateToken,
}) => {
  const [previewRon, setPreviewRon] = useState<string>('');

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    const getPreviewRon = async () => {
      const estimateRon = await estimateTokensByRon(initAmount);
      setPreviewRon(estimateRon);
    };
    getPreviewRon();
  }, [initAmount]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      isCentered
      closeOnOverlayClick={!loading}
    >
      <ModalOverlay />
      <StyledModalContent className="content">
        <ModalHeader>
          Choose how many [{ticker}] you want to buy
          <Text color="#BEBDBA" fontWeight="400">
            (optional)
          </Text>
        </ModalHeader>

        {!loading && <ModalCloseButton />}
        <ModalBody>
          <Box className="quantity-container">
            <Box>
              <InputGroup>
                <InputRightElement
                  display="flex"
                  gap={2}
                  pointerEvents="none"
                  height="100%"
                  mr={7}
                >
                  <Text color="white">RON</Text>
                  <Image src={RonIcon.src} alt="website-icon" width="25px" />
                </InputRightElement>
                <Input
                  className="input-group"
                  type="text"
                  placeholder="0.0 (optional)"
                  value={initAmount}
                  disabled={loading}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let value = e.target.value;
                    value = value.replace(/[^0-9.]/g, '');
                    const regex = /^\d*\.?\d*$/;
                    if (regex.test(value)) {
                      onChangeInitAmount(value);
                    }
                  }}
                />
              </InputGroup>
            </Box>
            {!!+previewRon && (
              <Box display="flex" gap={1} className="note">
                <Text>You receive </Text>
                <Text fontWeight="bold">~{Number(previewRon).toFixed(6)}</Text>
                <Text>{ticker}</Text>
              </Box>
            )}
            <Text className="note">
              {`[Tip: its optional but buying a small amount of tokens helps protect your token from snipers]`}
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter display="flex" flexDirection="column" gap={3}>
          <Button className="create-token-btn" onClick={onCreateToken}>
            {loading ? <Spinner /> : 'Create Token'}
          </Button>
        </ModalFooter>
      </StyledModalContent>
    </Modal>
  );
};

export default ConfirmPopup;

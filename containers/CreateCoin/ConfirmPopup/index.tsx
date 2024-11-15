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
  Text,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import RonIcon from '@/assets/icons/ron.png';
import Captcha from '@/components/Capcha';

import { StyledModalContent } from './index.style';

interface ConfirmPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateCoin: () => void;
}

const ConfirmPopup: React.FC<ConfirmPopupProps> = ({
  isOpen,
  onClose,
  onCreateCoin,
}) => {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleCaptchaVerify = (token: string) => {
    setCaptchaToken(token);
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <StyledModalContent className="content">
        <ModalHeader>
          Choose how many [SLB] you want to buy
          <Text color="#BEBDBA" fontWeight="400">
            (optional)
          </Text>
        </ModalHeader>

        <ModalCloseButton />
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
                  type="tel"
                  placeholder="0.0 (optional)"
                />
              </InputGroup>
            </Box>
            <Text className="note">
              [Tip: its optional but buying a small amount of coins helps
              protect your coin from snipers]
            </Text>
          </Box>
        </ModalBody>

        <ModalFooter display="flex" flexDirection="column" gap={3}>
          <Button className="create-coin-btn">Create Coin</Button>
          <Captcha onVerify={handleCaptchaVerify} />
        </ModalFooter>
      </StyledModalContent>
    </Modal>
  );
};

export default ConfirmPopup;

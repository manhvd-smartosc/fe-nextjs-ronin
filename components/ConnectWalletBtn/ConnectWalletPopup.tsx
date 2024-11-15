'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

import { IoArrowBack } from 'react-icons/io5';
import RoninIcon from '@/assets/icons/ron.png';
import { WalletConnectMethod } from '@/types/wallet';

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
  Flex,
} from '@chakra-ui/react';
import {
  ModalBackButton,
  ModalOpenAppButton,
  StyledConnectWalletModal,
  StyledLoadingContainer,
  StyledQRContainer,
  StyledWalletOption,
} from './index.style';
import axios from 'axios';

interface ConnectWalletPopupProps {
  isOpen: boolean;
  isConnecting: boolean;
  reownURI: string | null;
  connectMethod: WalletConnectMethod;
  onResetConnectMethod: () => void;
  onConnectExtensionWallet: () => Promise<void>;
  onConnectMobileWallet: () => Promise<void>;
  onClose: () => void;
}

const ConnectWalletPopup: React.FC<ConnectWalletPopupProps> = ({
  isOpen,
  isConnecting,
  reownURI,
  connectMethod,
  onResetConnectMethod,
  onConnectExtensionWallet,
  onConnectMobileWallet,
  onClose,
}) => {
  const renderContent = () => {
    const MOBILE_SCREEN_WIDTH = 700;

    const isMobile = () => {
      if (typeof window === 'undefined') {
        return false;
      }

      return window.screen.width <= MOBILE_SCREEN_WIDTH;
    };

    const isOnClient = () => {
      return typeof window !== 'undefined';
    };

    const isInAppBrowser = () => {
      if (isOnClient()) {
        return (
          // @ts-expect-error
          !!window?.isWalletApp &&
          // @ts-expect-error
          window?.ronin !== undefined &&
          !!window?.ethereum?.isRonin
        );
      } else {
        return false;
      }
    };

    const shouldRenderWalletMobile = !(isInAppBrowser() && isMobile());

    if (connectMethod !== WalletConnectMethod.MOBILE) {
      return (
        <>
          <ModalHeader>
            <Text>Connect Wallet</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display={'flex'}
            flexDirection={'row'}
            gap={2}
            justifyContent={'center'}
          >
            <StyledWalletOption
              disabled={isConnecting}
              onClick={onConnectExtensionWallet}
            >
              {isConnecting ? (
                <>
                  <Spinner
                    color="blue.500"
                    transitionDuration="0.8s"
                    height={8}
                    width={8}
                  />
                  <Text>Connecting...</Text>
                </>
              ) : (
                <>
                  <Image src={RoninIcon} alt="ronin" width={64} height={64} />
                  <Text>Ronin Extension</Text>
                </>
              )}
            </StyledWalletOption>
            {shouldRenderWalletMobile && (
              <StyledWalletOption
                disabled={isConnecting}
                onClick={onConnectMobileWallet}
              >
                {isConnecting ? (
                  <>
                    <Spinner
                      color="blue.500"
                      transitionDuration="0.8s"
                      height={8}
                      width={8}
                    />
                    <Text>Connecting...</Text>
                  </>
                ) : (
                  <>
                    <Image src={RoninIcon} alt="ronin" width={64} height={64} />
                    <Text>Ronin Mobile</Text>
                  </>
                )}
              </StyledWalletOption>
            )}
          </ModalBody>
        </>
      );
    } else {
      return (
        <>
          <ModalHeader textAlign={'center'}>
            <Text>Scan with Ronin Mobile</Text>
          </ModalHeader>
          <ModalBackButton onClick={onResetConnectMethod}>
            <IoArrowBack size="20px" />
          </ModalBackButton>
          <ModalCloseButton />
          <ModalBody display={'flex'} justifyContent={'center'}>
            {isConnecting || !reownURI ? (
              <StyledLoadingContainer>
                <Box height={reownURI ? 208 : 256} width={reownURI ? 208 : 256}>
                  <Spinner
                    color="purple.500"
                    transitionDuration="0.8s"
                    size={'xl'}
                  />
                </Box>
                {reownURI && (
                  <Text textAlign={'center'} fontSize={'md'}>
                    Please sign the message on your mobile wallet to
                    authenticate!
                  </Text>
                )}
              </StyledLoadingContainer>
            ) : (
              <Flex gap="1" direction="column">
                <StyledQRContainer>
                  <QRCodeSVG value={reownURI || ''} size={256} />
                </StyledQRContainer>
                {reownURI && isMobile() && (
                  <ModalOpenAppButton
                    onClick={async () => {
                      window?.open(
                        `https://wallet.roninchain.com/auth-connect?uri=${encodeURIComponent(
                          reownURI,
                        )}`,
                        '_blank',
                      );
                    }}
                  >
                    Open in Ronin Wallet {isConnecting && <Spinner />}
                  </ModalOpenAppButton>
                )}
              </Flex>
            )}
          </ModalBody>
        </>
      );
    }
  };
  const canCloseOverlay =
    !isConnecting &&
    Number(connectMethod) !== Number(WalletConnectMethod.MOBILE);
  return (
    <Modal
      isOpen={isOpen}
      closeOnOverlayClick={canCloseOverlay}
      closeOnEsc={canCloseOverlay}
      onClose={onClose}
    >
      <ModalOverlay />
      <StyledConnectWalletModal>
        {renderContent()}
        <ModalFooter>
          <Box display={'flex'} gap={'4px'}>
            <Text fontSize="sm" color="gray.400">
              Don't have ronin wallet? Get
            </Text>
            <Link href="https://wallet.roninchain.com/" target="blank">
              <Text fontSize="sm" color="purple.300">
                here
              </Text>
            </Link>
          </Box>
        </ModalFooter>
      </StyledConnectWalletModal>
    </Modal>
  );
};

export default ConnectWalletPopup;

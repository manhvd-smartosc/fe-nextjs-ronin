'use client';

import React, { useState } from 'react';
import Image from 'next/image';

import api from '@/apis';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import { signIn } from 'next-auth/react';
import { SiweMessage } from 'siwe';
import { handleError } from '@/utils';

import VectorImg from '@/assets/images/vector.png';
import { WalletConnectMethod } from '@/types/wallet';

import { Box, Text } from '@chakra-ui/react';
import ConnectWalletPopup from './ConnectWalletPopup';
import SwitchWalletPopup from './SwitchWalletPopup';
import { StyledConnectWalletBtnContainer } from './index.style';
import { Connector, ConnectorAlreadyConnectedError, useConnect } from 'wagmi';

const ConnectWalletBtn = () => {
  const { connectors, connectAsync } = useConnect();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitching, setSwitching] = useState<boolean>(false);
  const [popupOpenStatus, setPopupStatus] = useState<boolean>(false);
  const [connectMethod, setConnectMethod] = useState<WalletConnectMethod>(
    WalletConnectMethod.NONE,
  );
  const [uri, setUri] = useState<string | null>(null);

  const togglePopupStatus = () => {
    resetConnectMethod();
    setUri(null);
    setPopupStatus((prev) => !prev);
    setLoading(false);
  };

  const resetConnectMethod = () => setConnectMethod(WalletConnectMethod.NONE);

  const onAuth = async (
    walletConnector: Connector | null,
    account?: string,
  ) => {
    if (!walletConnector) {
      throw new Error('Connector is not ready! Please try again');
    }
    const provider = await walletConnector.getProvider();
    const accounts = (await walletConnector.getAccounts()).map((account) =>
      account.toString(),
    );

    if (!accounts) {
      throw new Error('No account found');
    }
    const currentAccount = account || accounts[0];
    const responseData = await api.auth.generateNonce({
      address: currentAccount,
    });
    const siweMessage = new SiweMessage({
      domain: window.location.hostname,
      address: ethers.getAddress(currentAccount),
      uri: window.location.origin,
      version: '1',
      chainId: Number(process.env.NEXT_PUBLIC_ALLOWED_CHAIN_ID),
      nonce: responseData.nonce,
      statement: "I accept the dApp's Terms of Service",
    });

    // @ts-expect-error
    const signature = await provider.request({
      // Send the public address to generate a nonce associates with our account
      method: 'personal_sign',
      params: [siweMessage.toMessage(), currentAccount],
    });

    // Use NextAuth to sign in with our address and the nonce
    await signIn('crypto', {
      publicAddress: currentAccount,
      message: JSON.stringify(siweMessage),
      signature: signature,
      redirect: false,
    });
  };

  const onConnectExtensionWallet = async () => {
    if (loading) {
      return;
    }

    const connector = connectors.find(
      (connector) =>
        connector.type === 'injected' &&
        connector.id === 'com.roninchain.wallet',
    );
    if (!connector) {
      return;
    }
    try {
      setConnectMethod(WalletConnectMethod.EXTENSION);
      setLoading(true);
      await connectAsync({ connector: connector! });
      await onAuth(connector);
      toast.success('Login successfully!');
    } catch (error) {
      if (error instanceof ConnectorAlreadyConnectedError) {
        // try auth again
        await onAuth(connector).catch(async (error) => {
          handleError(error, 'Login failed!');
          await connector.disconnect();
          resetConnectMethod();
        });
      } else {
        handleError(error, 'Login failed!');
        await connector.disconnect();
        resetConnectMethod();
      }
    } finally {
      setLoading(false);
    }
  };

  const listenForWalletConnectUri = async (
    walletConnectConnector: Connector,
  ) => {
    const provider = await walletConnectConnector.getProvider();

    // @ts-expect-error
    provider.once('display_uri', (uri) => {
      setUri(uri);
    });
  };
  const onConnectMobileWallet = async () => {
    if (loading) {
      return;
    }
    const connector = connectors.find(
      (connector) => connector.id === 'walletConnect',
    );
    if (!connector) {
      return;
    }
    try {
      listenForWalletConnectUri(connector);
      setConnectMethod(WalletConnectMethod.MOBILE);
      await connectAsync({ connector });
      await onAuth(connector);
      toast.success('Login successfully!');
    } catch (error) {
      handleError(error, 'Login failed!');
      await connector.disconnect();
      resetConnectMethod();
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box>
        <StyledConnectWalletBtnContainer
          className="connect-btn-container"
          onClick={togglePopupStatus}
        >
          <Image
            src={VectorImg.src}
            alt="vector"
            style={{objectFit:"cover"}}
            width={140}
            height={57}
          />
          <Text className="connect-btn">Connect Wallet</Text>
        </StyledConnectWalletBtnContainer>
      </Box>
      <ConnectWalletPopup
        isOpen={popupOpenStatus}
        isConnecting={loading}
        connectMethod={connectMethod}
        reownURI={uri}
        onClose={togglePopupStatus}
        onResetConnectMethod={resetConnectMethod}
        onConnectExtensionWallet={onConnectExtensionWallet}
        onConnectMobileWallet={onConnectMobileWallet}
      />
      <SwitchWalletPopup
        isOpen={isSwitching}
        onClose={() => setSwitching(false)}
      />
    </>
  );
};

export default ConnectWalletBtn;

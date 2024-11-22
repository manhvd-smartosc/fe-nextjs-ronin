import { Box, Text, Image, Flex, useBreakpointValue } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Spinner } from '@chakra-ui/react';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import { requestRoninWalletConnector } from '@sky-mavis/tanto-connect';

import { socketEmitter } from '@/lib-client/EventEmitter';
import VectorImg from '@/assets/images/vector.png';
import api from '@/apis';
import { API_URL, ROUTE } from '@/constants';

import { AddressInfoBtn } from './AddressInfoBtn';
import { StyledHeader } from './index.style';

interface HeaderProps {
  handleOpenHowItWork: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleOpenHowItWork }) => {
  const transactions = [
    {
      avatar:
        'https://fastly.picsum.photos/id/951/200/300.jpg?hmac=88jOMC9sFPf_Y7l4aMvDLBsqNuoprR9_Rvvbqb0oRPA',
      user: 'bump7759',
      action: 'sold',
      amount: '0.0123 RON',
      token: 'PPNUT',
    },
    {
      avatar:
        'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
      user: 'bump7759',
      action: 'bought',
      amount: '0.0123 RON',
      token: 'PPNUT',
    },
    {
      avatar:
        'https://fastly.picsum.photos/id/237/200/300.jpg?hmac=TmmQSbShHz9CdQm0NkEjx1Dyh_Y984R9LpNrpvH2D_U',
      user: 'bump7759',
      action: 'sold',
      amount: '0.0123 RON',
      token: 'PPNUT',
    },
  ];

  const { data: session } = useSession({
    required: false,
  });
  const router = useRouter();
  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });
  const [trans, setTrans] = useState(transactions);

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);
  const [userData, setUserData] = useState({ avatarUrl: '', name: '' });

  const onSignInWithCrypto = async () => {
    try {
      const connector = await requestRoninWalletConnector();
      const provider = await connector.getProvider();
      const accounts = await connector.requestAccounts();
      if (!accounts) {
        return;
      }
      const currentAccount = accounts[0];
      const responseData = await api.auth.generateNonce({
        address: currentAccount,
      });

      const siweMessage = new SiweMessage({
        domain: window.location.hostname,
        address: ethers.getAddress(currentAccount),
        uri: window.location.origin,
        version: '1',
        chainId: 2020,
        nonce: responseData.nonce,
        statement: "I accept the dApp's Terms of Service",
      });

      setLoadingLogin(true);
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

      toast.success('Login successfully!');
    } catch (error: any) {
      if (error?.name === 'ProviderNotFound') {
        toast.error('Please install Ronin Wallet');
        return;
      } else {
        toast.error('Login failed!');
      }
    } finally {
      setLoadingLogin(false);
    }
  };

  const fetchProfileDetail = async () => {
    const response = await fetch(
      `${API_URL.PROFILE}/${session?.user.publicAddress}`,
      {},
    );
    const data = await response.json();
    setUserData({ avatarUrl: data?.avatarUrl, name: data?.name });
  };

  const handleLogout = () => {
    router.push(ROUTE.HOME);
    signOut({ redirect: false });
    toast.success('Logout successfully!');
  };

  useEffect(() => {
    const getTransaction = () => {
      switch (currentSize) {
        case 'small':
          return setTrans([]);
        case 'medium':
          return setTrans(transactions.slice(0, 1));
        case 'large':
          return setTrans(transactions.slice(0, 2));
        default:
          return setTrans(transactions.slice(0, 3));
      }
    };
    getTransaction();
  }, [currentSize]);

  useEffect(() => {
    fetchProfileDetail();
  }, [session]);

  useEffect(() => {
    const handleUpdateProfile = (data: any) => {
      const { name, avatarUrl } = data.msg;
      setUserData({ name, avatarUrl });
    };
    socketEmitter.on('update-profile', handleUpdateProfile);
    return () => {
      socketEmitter && socketEmitter.off('update-profile', handleUpdateProfile);
    };
  }, []);

  return (
    <StyledHeader>
      <Box display="flex" gap={4}>
        <Image
          src="https://tama.meme/media/8bfb9a9d631a8cfe928a9238f9cbad0a.svg"
          className="site-image"
          alt="logo"
          onClick={() => router.push('/')}
        />
        <Flex className="site-link-container">
          <Box className="site-link" onClick={handleOpenHowItWork}>
            How it works
          </Box>
          <Box className="site-link">
            <Link
              href={process.env.NEXT_PUBLIC_SUPPORT_LINK || ''}
              passHref
              target="_blank"
            >
              Support
            </Link>
          </Box>
        </Flex>
      </Box>

      {currentSize !== 'small' && (
        <Flex className="transaction-container">
          <Box display="flex" whiteSpace="nowrap">
            {trans.map((tx, index) => (
              <Box display="flex" key={index}>
                <Box display="flex" alignItems="center" pl={2}>
                  <Image
                    src={tx.avatar}
                    width="20px"
                    height="20px"
                    borderRadius="50%"
                  />
                </Box>
                <Box
                  key={index}
                  display="flex"
                  gap={1}
                  p={2}
                  borderRight={
                    index < transactions.length - 1
                      ? '1px solid #1B242D'
                      : undefined
                  }
                >
                  <Text>{tx.user}</Text>
                  <Text
                    fontWeight={600}
                    color={tx.action === 'sold' ? 'red.300' : 'green.300'}
                  >
                    {tx.action}
                  </Text>
                  <Text>
                    {tx.amount} of {tx.token}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        </Flex>
      )}
      {session?.user?.publicAddress ? (
        <AddressInfoBtn
          name={userData?.name}
          avatarUrl={userData?.avatarUrl}
          address={session?.user?.publicAddress}
          onLogout={handleLogout}
        />
      ) : (
        <Box display="flex" gap={2} alignItems="center">
          <Box className="connect-btn-container" onClick={onSignInWithCrypto}>
            <Image
              src={VectorImg.src}
              alt="vector"
              objectFit="cover"
              width="140px"
            />
            <Text className="connect-btn">Connect Wallet</Text>
          </Box>
          {loadingLogin && (
            <Spinner color="blue.500" transitionDuration="0.8s" />
          )}
        </Box>
      )}
    </StyledHeader>
  );
};

export default Header;

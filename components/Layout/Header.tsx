import { Box, Text, Image, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { toast } from 'react-toastify';
import { Spinner } from '@chakra-ui/react';
import Link from 'next/link';

import VectorImg from '@/assets/images/vector.png';
import { API_URL } from '@/constants';
import LogoutIcon from '@/assets/icons/logout.svg';
import { shortenAddress } from '@/utils/address';

import { StyledHeader } from './index.style';

declare global {
  interface Window {
    ronin?: any;
  }
}

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

interface HeaderProps {
  handleOpenHowItWork: () => void;
}

const Header: React.FC<HeaderProps> = ({ handleOpenHowItWork }) => {
  const { data: session } = useSession({
    required: false,
  });

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

  const onSignInWithCrypto = async () => {
    try {
      const provider = window.ronin.provider;
      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      if (!accounts) {
        return;
      }
      const currentAccount = accounts[0];

      const response = await fetch(API_URL.GENERATE_NONCE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          publicAddress: currentAccount,
        }),
      });
      const responseData = await response.json();

      setLoadingLogin(true);
      const signedNonce = await provider.request({
        // Send the public address to generate a nonce associates with our account
        method: 'personal_sign',
        params: [responseData.nonce, currentAccount],
      });

      // Use NextAuth to sign in with our address and the nonce
      await signIn('crypto', {
        publicAddress: currentAccount,
        signedNonce: signedNonce,
        redirect: false,
      });

      setLoadingLogin(false);
      toast.success('Login successfully!');
    } catch (error) {
      window.alert(`Error with signing, please try again. ${error}`);
    }
  };

  const handleLogout = () => {
    signOut({ redirect: false });
    toast.success('Logout successfully!');
  };

  return (
    <StyledHeader>
      <Image
        src="https://tama.meme/media/8bfb9a9d631a8cfe928a9238f9cbad0a.svg"
        className="site-image"
        alt="logo"
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
      <Flex className="transaction-container ">
        <Box display="flex" whiteSpace="nowrap">
          {transactions.map((tx, index) => (
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
      {session?.user?.publicAddress ? (
        <Box display="flex" p={2} gap={2}>
          <Text>{shortenAddress(session?.user?.publicAddress, 5)}</Text>
          <Box cursor="pointer" onClick={handleLogout}>
            <Image src={LogoutIcon.src} />
          </Box>
        </Box>
      ) : (
        <>
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
            <Spinner color="blue.500" animationDuration="0.8s" />
          )}
        </>
      )}
    </StyledHeader>
  );
};

export default Header;

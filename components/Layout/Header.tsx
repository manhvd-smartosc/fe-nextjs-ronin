import {
  Box,
  Text,
  Image,
  Flex,
  PopoverTrigger,
  Button,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Popover,
} from '@chakra-ui/react';
import React, { useState } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { Spinner } from '@chakra-ui/react';
import { SiweMessage } from 'siwe';
import { ethers } from 'ethers';
import { requestRoninWalletConnector } from '@sky-mavis/tanto-connect';
import { IoCopyOutline } from 'react-icons/io5';
import { IoMdArrowDropdown } from 'react-icons/io';
import { LuExternalLink } from 'react-icons/lu';

import VectorImg from '@/assets/images/vector.png';
import { API_URL } from '@/constants';
import { shortenAddress } from '@/utils/address';

import { StyledAddressInfoBtn, StyledHeader } from './index.style';

declare global {
  interface Window {
    ronin?: any;
  }
}

type AddressInfoBtnProps = {
  name?: string;
  address?: string;
  onLogout: () => void;
};

export const AddressInfoBtn = ({
  name,
  address,
  onLogout,
}: AddressInfoBtnProps) => {
  const router = useRouter();

  return (
    <StyledAddressInfoBtn>
      <Popover placement="bottom-end">
        {({ onClose }) => (
          <>
            <PopoverTrigger>
              <Button className="address-info-btn" size="sm" variant="outline">
                <Image
                  src="https://fastly.picsum.photos/id/951/200/300.jpg?hmac=88jOMC9sFPf_Y7l4aMvDLBsqNuoprR9_Rvvbqb0oRPA"
                  width="20px"
                  height="20px"
                  borderRadius="50%"
                />
                <Text>8XhtK7</Text>
                <IoMdArrowDropdown />
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverBody>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center">
                    <Text fontSize="16px" fontWeight="700">
                      My Account
                    </Text>
                  </Box>
                  <Button onClick={onLogout} className="logout-btn">
                    Logout
                  </Button>
                </Box>
                <Box
                  mt={5}
                  display="flex"
                  gap={2}
                  pb={5}
                  borderBottom="1px solid #302E2C"
                >
                  <Box>
                    <Image
                      src="https://fastly.picsum.photos/id/951/200/300.jpg?hmac=88jOMC9sFPf_Y7l4aMvDLBsqNuoprR9_Rvvbqb0oRPA"
                      width="48px"
                      height="48px"
                      borderRadius="50%"
                    />
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="center"
                    flexDirection="column"
                    gap={1}
                  >
                    <Text textAlign="left" fontSize="16px" fontWeight="500">
                      {name || '@8XhtK7'}
                    </Text>
                    <Box display="flex" gap={2}>
                      <Text textAlign="left" color="#BEBDBA">
                        {shortenAddress(address, 5) || '0x205...2ee8'}
                      </Text>
                      <IoCopyOutline
                        color="#05AAD7"
                        size={18}
                        cursor="pointer"
                      />
                    </Box>
                  </Box>
                </Box>
                <Box display="flex" gap={2} mt={5}>
                  <Text className="view-profile">View Profile</Text>
                  <LuExternalLink
                    color="#AC65F3"
                    size={18}
                    onClick={() => {
                      router.push('/profile');
                      onClose();
                    }}
                    cursor="pointer"
                  />
                </Box>
              </PopoverBody>
            </PopoverContent>
          </>
        )}
      </Popover>
    </StyledAddressInfoBtn>
  );
};

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

  const [loadingLogin, setLoadingLogin] = useState<boolean>(false);

  const onSignInWithCrypto = async () => {
    try {
      const connector = await requestRoninWalletConnector();
      const provider = await connector.getProvider();
      const accounts = await connector.requestAccounts();
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

      <Flex className="transaction-container">
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
        <AddressInfoBtn
          address={session?.user?.publicAddress}
          onLogout={handleLogout}
        />
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
            <Spinner color="blue.500" transitionDuration="0.8s" />
          )}
        </>
      )}
    </StyledHeader>
  );
};

export default Header;

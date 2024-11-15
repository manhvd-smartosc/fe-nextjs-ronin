import React, { useCallback, useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { AppSyncEventType, socketEmitter } from '@/lib-client/EventEmitter';
import PepeImg from '@/assets/images/pepe.png';

import { AiOutlineMenuUnfold } from 'react-icons/ai';
import { API_URL, ROUTE } from '@/constants';
import api from '@/apis';

import {
  Box,
  Text,
  Image,
  Flex,
  useBreakpointValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
} from '@chakra-ui/react';
import { useAccount } from 'wagmi';
import { watchAccount } from '@wagmi/core';
import { config } from '@/configs/wagmi';

import { AddressInfoBtn } from './AddressInfoBtn';
import { StyledHeader } from './index.style';
import ConnectWalletBtn from '../ConnectWalletBtn';
import { getFirstSixChars } from '@/utils/address';
import { formatLargeNumber } from '@/utils/number';
import Big from 'big.js';

interface HeaderProps {
  handleOpenHowItWork: () => void;
}

const SHAKE_DURATION = 500;

const Header: React.FC<HeaderProps> = ({ handleOpenHowItWork }) => {
  const { connector: activeConnector } = useAccount();
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
  const [trans, setTrans] = useState<any[]>([]);
  const [shakeCards, setShakeCards] = useState<string[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [userData, setUserData] = useState({
    avatarUrl: '',
    name: '',
    bio: '',
  });

  const fetchProfileDetail = async () => {
    if (!session?.user.publicAddress) {
      return;
    }
    const response = await fetch(
      `${API_URL.PROFILE}/${session?.user.publicAddress}`,
      {},
    );

    const data = await response.json();
    setUserData({
      avatarUrl: data?.avatarUrl,
      name: data?.name,
      bio: data?.bio,
    });
  };

  useEffect(() => {
    let unwatch: () => void;
    if (typeof activeConnector !== 'undefined') {
      unwatch = watchAccount(config, {
        async onChange(account, prevAccount) {
          if (account?.address === prevAccount.address) {
            return;
          }
          if (activeConnector && activeConnector?.disconnect) {
            await activeConnector?.disconnect();
          }
          await signOut({ redirect: false });
          router.push(ROUTE.HOME);
        },
      });
    }

    return () => {
      if (unwatch) {
        unwatch();
      }
    };
  }, [activeConnector]);

  const numberOfTransaction = useCallback(() => {
    switch (currentSize) {
      case 'small':
        return 0;
      case 'medium':
        return 1;
      case 'large':
        return 2;
      default:
        return 3;
    }
  }, [currentSize]);

  useEffect(() => {
    const getTransaction = async () => {
      try {
        setLoading(true);
        const data = await api.trade.fetchListTrade({
          page: 1,
          limit: 3,
        });
        setTrans(data?.items || []);
      } catch (error) {
        // toast.error('Get list token error');
      } finally {
        setLoading(false);
      }
    };
    getTransaction();
  }, []);

  useEffect(() => {
    fetchProfileDetail();
  }, [session]);

  useEffect(() => {
    const handleUpdateProfile = (data: any) => {
      const { name, avatarUrl, bio } = data.msg;
      setUserData({ name, avatarUrl, bio });
    };
    socketEmitter.on('update-profile', handleUpdateProfile);
    return () => {
      socketEmitter && socketEmitter.off('update-profile', handleUpdateProfile);
    };
  }, []);

  // watch trade
  useEffect(() => {
    const handleTrading = (data: any) => {
      const tokenData = data.token;
      setTrans((prevList) => {
        const tmpData = {
          type: data?.isBuy ? 'BUY' : 'SELL',
          tokenAmount: data?.isBuy ? data?.amountOut : data?.amountIn,
          token: {
            address: tokenData?.address,
            ticker: tokenData?.ticker,
          },
          user: {
            address: data?.senderAddress?.address,
            avatarUrl: data?.senderAddress?.avatarUrl,
            name: data?.senderAddress?.name,
          },
          transactionHash: data?.txHash,
        };
        if (data?.txHash) {
          setShakeCards((prev) => [data?.txHash, ...prev]);
          setTimeout(() => {
            const temp = shakeCards.filter((card) => card !== data?.txHash);
            setShakeCards(temp);
          }, SHAKE_DURATION);
        }
        const tmpList = [tmpData, ...prevList].slice(0, 3);
        return tmpList;
      });
    };

    if (!loading) {
      socketEmitter.on(AppSyncEventType.TRADE, handleTrading);
    }
    return () => {
      if (socketEmitter) {
        socketEmitter.off(AppSyncEventType.TRADE, handleTrading);
      }
    };
  }, [loading]);

  const renderName = (user: { name: string; address: string }) => {
    return user?.name || getFirstSixChars(user?.address);
  };

  return (
    <StyledHeader>
      <Box display="flex" gap={4}>
        {currentSize === 'small' && (
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <AiOutlineMenuUnfold color="white" size="35px" />
            </PopoverTrigger>
            <PopoverContent
              background="transparent"
              border="none"
              top="60px"
              left="6px"
              width="200px"
            >
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverBody
                background="#0A0A0A"
                display="flex"
                flexDirection="column"
                gap={2}
                border="1px solid #3a3a38"
                borderRadius="20px"
              >
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
              </PopoverBody>
            </PopoverContent>
          </Popover>
        )}

        <Image
          src="https://tama.meme/media/8bfb9a9d631a8cfe928a9238f9cbad0a.svg"
          className="site-image"
          alt="logo"
          onClick={() => router.push('/')}
        />
        {currentSize !== 'small' && (
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
        )}
      </Box>

      {currentSize !== 'small' && (trans || []).length > 0 && (
        <Flex className="transaction-container">
          <Box display="flex" whiteSpace="nowrap">
            {trans.slice(0, numberOfTransaction()).map((tx, index) => (
              <Box
                display="flex"
                key={`${tx?.transactionHash}-${index}`}
                className={`${
                  shakeCards.includes(tx?.transactionHash?.toLowerCase())
                    ? 'animate-shake'
                    : ''
                }`}
              >
                <Box display="flex" alignItems="center" pl={2}>
                  <Link href={`${ROUTE.PROFILE}/${tx?.user?.address}`}>
                    <Image
                      src={tx?.user?.avatarUrl || PepeImg.src}
                      width="20px"
                      height="20px"
                      borderRadius="50%"
                    />
                  </Link>
                </Box>
                <Box
                  key={index}
                  display="flex"
                  gap={1}
                  p={2}
                  borderRight={
                    index < trans.slice(0, numberOfTransaction()).length - 1
                      ? '1px solid #1B242D'
                      : undefined
                  }
                >
                  <Link href={`${ROUTE.PROFILE}/${tx?.user?.address}`}>
                    <Text _hover={{ textDecoration: 'underline' }}>
                      {renderName(tx?.user)}
                    </Text>
                  </Link>
                  <Text
                    fontWeight={600}
                    color={tx?.type !== 'BUY' ? 'red.300' : 'green.300'}
                  >
                    {tx?.type?.toLowerCase() === 'buy' ? 'bought' : 'sold'}
                  </Text>
                  <Text>{formatLargeNumber(new Big(tx?.tokenAmount))} of</Text>
                  <Link href={`/token/${tx?.token?.address}`}>
                    <Text _hover={{ textDecoration: 'underline' }}>
                      {tx?.token?.ticker}
                    </Text>
                  </Link>
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
          bio={userData?.bio}
          address={session?.user?.publicAddress}
        />
      ) : (
        <Box display="flex" gap={2} alignItems="center">
          <ConnectWalletBtn />
        </Box>
      )}
    </StyledHeader>
  );
};

export default Header;

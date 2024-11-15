import React, { useEffect, useState } from 'react';
import { Box, Flex, Image, Text, Link, Skeleton, Icon } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { toast } from 'react-toastify';
import Big from 'big.js';

import ReplayIcon from '@/assets/icons/replay.svg';
import { formatLargeNumber } from '@/utils/number';
import { ROUTE } from '@/constants';

interface TokenCardProps {
  token: any;
  onRefresh: ({ tokenAddress }: { tokenAddress: string }) => any;
  listRonPrice: any[];
}

const TokenHeldCard: React.FC<TokenCardProps> = ({
  token,
  onRefresh,
  listRonPrice,
}) => {
  const [balance, setBalance] = useState<string>(token?.balance || '');
  const [ronPrice, setRonPrice] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);

  const handleRefreshBalance = async ({
    tokenAddress,
  }: {
    tokenAddress: string;
  }) => {
    if (!tokenAddress) return;
    try {
      setLoading(true);
      const response = await onRefresh({ tokenAddress });
      if (response?.balance) {
        setBalance(response.balance);
      }
      if (response?.ronPrice) {
        setRonPrice(response.ronPrice);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error('Refresh balance error');
    }
  };

  const fetchData = async () => {
    if (token && listRonPrice) {
      setBalance(token?.balance);
      const ronPriceData = listRonPrice.find(
        (item: any) => item?.tokenAddress === token?.token?.address,
      );
      if (ronPriceData) {
        setRonPrice(new Big(ronPriceData?.estimatedETH).toFixed(6).toString());
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [token, listRonPrice]);

  return (
    <Box
      p={4}
      bg="#FFFFFF0A"
      border="2px solid"
      borderColor="#E9DFF233"
      borderRadius="16px"
      backdropFilter={'blur(40px)'}
      boxShadow="0px -2px 1px 1px #AC65F3 inset, 0px -2px 3px 0px #FFFFFF inset"
    >
      <Flex align={'start'} justify="space-between">
        <Flex align="center">
          <Image
            src={token?.token?.imageUrl || ''}
            alt={token?.token?.name}
            boxSize="42px"
            borderRadius="full"
            bg="white"
            mr={3}
          />
          <Box>
            <Skeleton
              isLoaded={!loading}
              startColor="#1a1a1a"
              endColor="#8A8986"
            >
              <Text
                fontWeight="700"
                color="#FAF7ED"
                fontSize="16px"
                lineHeight="22px"
              >
                {`${formatLargeNumber(new Big(balance).div(10 ** 18)) || ''} ${
                  token?.token?.ticker
                }`}
              </Text>
              <Text
                fontSize="14"
                fontWeight={400}
                lineHeight={'20px'}
                color="#3DD37C"
              >
                {`${formatLargeNumber(new Big(ronPrice))} RON`}
              </Text>
            </Skeleton>
          </Box>
        </Flex>

        <Image
          src={ReplayIcon.src}
          alt="refresh"
          cursor="pointer"
          onClick={() =>
            handleRefreshBalance({ tokenAddress: token?.token?.address })
          }
        />
      </Flex>
      <Box mt={4} borderTop="1px solid" borderColor="#E9DFF233" pt={2}>
        <Link
          href={`${ROUTE.TOKEN}/${token?.token?.address}`}
          fontSize="14"
          fontWeight={500}
          lineHeight={'20px'}
          color="#FAF7ED"
          _hover={{ color: 'purple.400' }}
        >
          View token{' '}
          <ExternalLinkIcon
            color={'#FAF7ED'}
            _hover={{ color: 'purple.400' }}
            mx="2px"
          />
        </Link>
      </Box>
    </Box>
  );
};

export default TokenHeldCard;

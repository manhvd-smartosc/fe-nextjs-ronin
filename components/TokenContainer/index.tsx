'use client';
import { useEffect } from 'react';
import { Flex, Image, Text, VStack, HStack } from '@chakra-ui/react';
import Big from 'big.js';
import { toast } from 'react-toastify';
import { socketEmitter } from '@/lib-client/EventEmitter';
import { truncateString } from '@/utils/string';
import RelativeTime from '@/components/RelativeTime';
import useRonin from '@/hooks/useRonin';
import { formatLargeNumber } from '@/utils/number';
import { StyledTokenContainer } from './index.style';

export type TokenType = {
  address: string;
  createdAt: string;
  createdBy: string;
  description: string;
  id: string;
  imageUrl: string;
  lastBuy: string | null;
  lastComment: string | null;
  lastMcap: string;
  lastPrice: string;
  name: string;
  poolId: string | null;
  telegramUrl: string | null;
  ticker: string;
  twitterUrl: string;
  websiteUrl: string;
  totalComments: string;
};

const TokenContainer = ({ token }: { token: TokenType }) => {
  const { price: roninPrice } = useRonin();
  useEffect(() => {
    console.log('mount');
    const handleChannel = (data: any) => {
      console.count(JSON.stringify(data));
    };
    socketEmitter.on('channel', handleChannel);
    return () => {
      console.log('unmount');
      socketEmitter && socketEmitter.off('channel', handleChannel);
    };
  }, []);

  const calculateLastMCap = (marketCapInRon: string) => {
    try {
      if (roninPrice) {
        const marketCapBig = new Big(marketCapInRon || 0);
        const roninPriceBig = new Big(roninPrice);
        const result = marketCapBig.times(roninPriceBig).round(0);

        return formatLargeNumber(result);
      }
      return '0';
    } catch (error) {
      toast.error('Error calculating market cap');
    }
  };

  return (
    <StyledTokenContainer>
      <Flex gap={1}>
        <Image src={token.imageUrl} alt="Icon" className="image" />

        <VStack align="start" flex="1">
          <HStack justify="space-between" w="100%">
            <Text color="gray.400" fontSize="sm">
              ticker: {token.ticker}
            </Text>
            <Text fontSize="xs" color="gray.400">
              <RelativeTime timestamp={token.createdAt} />
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="bold">
            {token.name}
          </Text>
          <Text color="#3DD37C" fontSize="sm">
            Market cap: {calculateLastMCap(token.lastMcap)}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {truncateString(token.description)}
          </Text>
          <Text fontSize="xs" color="gray.400">
            replies: {token.totalComments || 0}
          </Text>
        </VStack>
      </Flex>
    </StyledTokenContainer>
  );
};

export default TokenContainer;

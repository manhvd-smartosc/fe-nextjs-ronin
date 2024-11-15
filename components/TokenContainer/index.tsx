'use client';
import { useEffect } from 'react';
import { Flex, Image, Text, VStack, HStack } from '@chakra-ui/react';
import { socketEmitter } from '@/lib-client/EventEmitter';
import { truncateString } from '@/utils/string';
import RelativeTime from '@/components/RelativeTime';
import { StyledTokenContainer } from './index.style';
import { TokenType } from '../index';

const TokenContainer = ({ token }: { token: TokenType }) => {
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
            Market cap: {token.lastMcap}
          </Text>
          <Text fontSize="sm" color="gray.400">
            {truncateString(token.description)}
          </Text>
          <Text fontSize="xs" color="gray.400">
            replies: 3
          </Text>
        </VStack>
      </Flex>
    </StyledTokenContainer>
  );
};

export default TokenContainer;

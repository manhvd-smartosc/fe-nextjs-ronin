'use client';
import { useEffect } from 'react';
import { Flex, Image, Text, VStack, HStack } from '@chakra-ui/react';
import ElonMusk from '@/assets/images/elon-musk.png';
import { StyledTokenContainer } from './index.style';
import { socketEmitter } from '@/lib-client/EventEmitter';

const TokenContainer = () => {
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
        <Image src={ElonMusk.src} alt="Icon" className="image" />

        <VStack align="start" flex="1">
          <HStack justify="space-between" w="100%">
            <Text color="gray.400" fontSize="sm">
              ticker: Pnut MoM
            </Text>
            <Text fontSize="xs" color="gray.400">
              1h ago
            </Text>
          </HStack>
          <Text fontSize="lg" fontWeight="bold">
            Pnut Mom Confirmed
          </Text>
          <Text color="#3DD37C" fontSize="sm">
            Market cap: 43.87k
          </Text>
          <Text fontSize="sm" color="gray.400">
            The clock's ticking. Tired of scams and rugs? Real FOMO has arrived
            with #FOMOki.
          </Text>
          <Text fontSize="xs" color="gray.400">
            replies: 33
          </Text>
        </VStack>
      </Flex>
    </StyledTokenContainer>
  );
};

export default TokenContainer;

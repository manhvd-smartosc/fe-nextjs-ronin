import React from 'react';
import { Box, Flex, Image, Text, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { IoReload } from 'react-icons/io5';
import { TokenType } from '../TokenContainer';

interface CoinCardProps {
  token: TokenType;
  onRefresh: () => void;
}

const CoinHeldCard: React.FC<CoinCardProps> = ({ token, onRefresh }) => {
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
            src={token?.imageUrl || ''}
            alt={token?.name}
            boxSize="42px"
            borderRadius="full"
            bg="white"
            mr={3}
          />
          <Box>
            <Text
              fontWeight="700"
              color="#FAF7ED"
              fontSize="16px"
              lineHeight="22px"
            >
              {`${token?.name}`}
            </Text>
            <Text
              fontSize="14"
              fontWeight={400}
              lineHeight={'20px'}
              color="#3DD37C"
            >
              {token?.ticker || ''}
            </Text>
          </Box>
        </Flex>
        <IoReload cursor={'pointer'} />
      </Flex>
      <Box mt={4} borderTop="1px solid" borderColor="#E9DFF233" pt={2}>
        <Link
          href="#"
          isExternal
          fontSize="14"
          fontWeight={500}
          lineHeight={'20px'}
          color="#FAF7ED"
          _hover={{ color: 'purple.400' }}
        >
          View coin{' '}
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

export default CoinHeldCard;

import React from 'react';
import { Box, Flex, Image, Text, Link } from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { IoReload } from 'react-icons/io5';

interface TokenCardProps {
  name: string;
  quantity: number;
  value: string;
  imageUrl: string;
  onRefresh: () => void;
}

const HeadTokenCard: React.FC<TokenCardProps> = ({
  name,
  value,
  quantity,
  imageUrl,
  onRefresh,
}) => {
  return (
    <Box
      p={4}
      bg="#FFFFFF0A"
      border="2px solid"
      borderColor="gray.600"
      borderRadius="16px"
      backdropFilter={'blur(40px)'}
      boxShadow="0px -2px 1px 1px #AC65F3 inset, 0px -2px 3px 0px #FFFFFF inset"
    >
      <Flex align={'start'} justify="space-between">
        <Flex align="center">
          <Image
            src={imageUrl}
            alt={name}
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
              {`${quantity} ${name}`}
            </Text>
            <Text
              fontSize="14"
              fontWeight={400}
              lineHeight={'20px'}
              color="#3DD37C"
            >
              {value}
            </Text>
          </Box>
        </Flex>
        <IoReload cursor={'pointer'} />
      </Flex>
      <Box mt={4} borderTop="1px solid" borderColor="gray.700" pt={2}>
        <Link
          href="#"
          isExternal
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

export default HeadTokenCard;

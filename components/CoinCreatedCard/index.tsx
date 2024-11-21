import {
  Box,
  Flex,
  HStack,
  Image,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react';
import { StyledCoinCreatedContainer } from './index.style';

interface CoinCreated {
  id: number | string;
  title: string;
  ticker: string;
  marketCap: string;
  description: string;
  replies: number;
  imageUrl: string;
  timeAgo: string;
}

interface CoinCreatedCardProps {
  data: CoinCreated;
}

const CoinCreatedCard: React.FC<CoinCreatedCardProps> = ({ data }) => {
  return (
    <StyledCoinCreatedContainer
      p={3}
      bg="#FFFFFF0A"
      border="2px solid"
      borderColor="#E9DFF233"
      borderRadius="16px"
      backdropFilter={'blur(40px)'}
      boxShadow="0px -2px 1px 1px #AC65F3 inset, 0px -2px 3px 0px #FFFFFF inset"
    >
      <Flex gap={1}>
        <Image src={data.imageUrl} alt="Icon" className="image" />

        <VStack align="stretch" spacing={1} justifyContent={'space-between'}>
          <HStack justify="space-between" w="100%">
            <Text
              color="#8A8986"
              fontSize="12"
              fontWeight={400}
              lineHeight={'16px'}
            >
              {`ticker: ${data.ticker}`}
            </Text>
            <Text
              fontSize="12"
              fontWeight={400}
              lineHeight={'16px'}
              color="#B7B5B1"
            >
              {data.timeAgo}
            </Text>
          </HStack>
          <Text
            color={'#FAF7ED'}
            fontSize="16"
            fontWeight="700"
            lineHeight={'22px'}
          >
            {data.title}
          </Text>
          <Text
            color="#3DD37C"
            fontSize="12"
            fontWeight={400}
            lineHeight={'16px'}
          >
            {`market cap: ${data.marketCap}`}
          </Text>
          <Text
            fontSize="12"
            fontWeight={400}
            lineHeight={'16px'}
            color="#BEBDBA"
          >
            {data.description}
          </Text>
          <Text
            fontSize="12"
            fontWeight={400}
            lineHeight={'16px'}
            color="#BEBDBA"
          >
            {`replies: ${data.replies}`}
          </Text>
        </VStack>
      </Flex>
    </StyledCoinCreatedContainer>
  );
};

export default CoinCreatedCard;

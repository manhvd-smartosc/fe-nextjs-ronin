'use client';
import { Flex, Image, Text, VStack, HStack, Box } from '@chakra-ui/react';
import Big from 'big.js';
import Link from 'next/link';
import { truncateString } from '@/utils/string';
import RelativeTime from '@/components/RelativeTime';
import PepeImg from '@/assets/images/pepe.png';
import { formatLargeNumber, formatLargeNumberInt } from '@/utils/number';
import { getFirstSixChars } from '@/utils/address';
import { useRouter } from 'next/router';
import { ROUTE } from '@/constants';
import useRoninPrice from '@/hooks/useRoninPrice';
import { calculateLastMCap } from '@/utils/fee';
import { StyledTokenContainer } from './index.style';

export type TokenType = {
  address: string;
  createdAt: number;
  createdBy: string;
  description: string;
  id?: string;
  imageUrl: string;
  lastBuy: number | null;
  lastComment: number | null;
  lastFeatured: number | null;
  lastMcap: number;
  lastPrice: number;
  name: string;
  poolId: string | null;
  telegramUrl: string | null;
  ticker: string;
  twitterUrl: string;
  websiteUrl: string;
  totalComments: number;
  User: {
    avatarUrl: string;
    name: string;
    address: string;
  };
};

const TokenContainer = ({
  token,
  shake,
}: {
  token: TokenType;
  shake: boolean;
}) => {
  const router = useRouter();

  const { price: roninPrice } = useRoninPrice();

  const formatLastMCap = (marketCapInRon: string) => {
    if (roninPrice) {
      const price = calculateLastMCap(marketCapInRon, roninPrice);
      return formatLargeNumber(new Big(price));
    }
    return '0';
  };

  return (
    <StyledTokenContainer
      className={`${shake ? 'animate-shake' : ''}`}
      onClick={(e) => {
        if (!(e.target instanceof HTMLAnchorElement)) {
          router.push(`${ROUTE.TOKEN}/${token.address}`);
        }
      }}
      _hover={{
        cursor: 'pointer',
        boxShadow: 'inset 0px -4px 2px 2px #ac65f3, inset 0px -2px 8px #ffffff',
      }}
    >
      <Flex gap={1}>
        <Image src={token.imageUrl} alt="Icon" className="image" />

        <VStack align="start" flex="1" fontSize="12px">
          <HStack justify="space-between" w="100%">
            <Box color="#8A8986" display="flex" gap={1}>
              <Text mr={1}>Created By:</Text>
              <Image
                src={token.User.avatarUrl || PepeImg.src}
                alt=""
                className=""
                width="16px"
                height="16px"
              />
              <Box _hover={{ textDecoration: 'underline' }}>
                <Link
                  href={`${ROUTE.PROFILE}/${token.User.address}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {token.User.name || getFirstSixChars(token.User.address)}
                </Link>
              </Box>
            </Box>
            <Text color="#8A8986" fontWeight={500}>
              <RelativeTime timestamp={token.createdAt} />
            </Text>
          </HStack>
          <Text color="#8A8986" fontWeight={700}>
            Ticker ({token.ticker})
          </Text>
          <Text fontSize="16px" fontWeight="bold">
            {token.name}
          </Text>
          <Text color="#3DD37C">
            Market cap: ${formatLastMCap(token.lastMcap.toString())}
          </Text>
          <Text color="gray.400">{truncateString(token.description)}</Text>
          <Text fontSize="xs" color="gray.400">
            replies: {formatLargeNumberInt(new Big(token.totalComments || 0))}
          </Text>
        </VStack>
      </Flex>
    </StyledTokenContainer>
  );
};

export default TokenContainer;

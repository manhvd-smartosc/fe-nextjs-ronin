import React, { useEffect, useState } from 'react';
import apis from '@/apis';
import { Box, Image, Text } from '@chakra-ui/react';
import AvatarImage from '@/assets/images/pepe.png';
import { getDifferenceTime } from '@/utils';
import useRoninPrice from '@/hooks/useRoninPrice';
import { calculateLastMCap } from '@/utils/fee';
import Big from 'big.js';
import { formatLargeNumber, formatLargeNumberInt } from '@/utils/number';
import { getFirstSixChars } from '@/utils/address';
import Link from 'next/link';
import { ROUTE } from '@/constants';

interface SummaryInfoProps {
  data: any;
}

const SummaryInfo: React.FC<SummaryInfoProps> = ({ data }) => {
  const [userInfo, setUserInfo] = useState<any>();
  const { price: roninPrice } = useRoninPrice();

  const formatLastMCap = (marketCapInRon: string) => {
    if (roninPrice) {
      const price = calculateLastMCap(marketCapInRon, roninPrice);
      return formatLargeNumber(new Big(price));
    }
    return '0';
  };

  const fetchUserInfo = async () => {
    if (data?.createdBy) {
      try {
        const response = await apis.profile.fetchProfileDetail({
          address: data?.createdBy as string,
        });

        if (response) {
          setUserInfo(response);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    fetchUserInfo();
  }, [data]);

  return (
    <Box className="sumary-section">
      <Text fontSize={16} fontWeight={400} lineHeight={'22px'} color="#FAF7ED">
        {`${data?.name} [${data?.ticker}]`}
      </Text>
      <Box className="user-info">
        <Text
          fontSize={14}
          fontWeight={500}
          lineHeight={'20px'}
          color="#8A8986"
        >
          by
        </Text>
        <Link
          href={`${ROUTE.PROFILE}/${data?.createdBy}`}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Image
            w="20px"
            h="20px"
            src={userInfo?.imageUrl || AvatarImage.src}
            alt="avatar user"
          />
          <Text
            fontSize={14}
            fontWeight={500}
            lineHeight={'20px'}
            color="#FAF7ED"
            _hover={{ textDecoration: 'underline' }}
          >
            {userInfo?.name || getFirstSixChars(userInfo?.address)}
          </Text>
        </Link>
      </Box>
      <Text fontSize={14} fontWeight={500} lineHeight={'20px'} color="#05AAD7">
        {getDifferenceTime(data?.createdAt)}
      </Text>
      <Text fontSize={14} fontWeight={500} lineHeight={'20px'} color="#3DD37C">
        market cap: ${formatLastMCap(data?.lastMcap)}
      </Text>
      <Text fontSize={14} fontWeight={500} lineHeight={'20px'} color="#BEBDBA">
        replies: {formatLargeNumberInt(new Big(data?.totalComments || 0))}
      </Text>
    </Box>
  );
};

export default SummaryInfo;

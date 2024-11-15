import React, { useEffect, useState } from 'react';
import { Box, ListItem, OrderedList, Text } from '@chakra-ui/react';

import BubbleMap from '../BubbleMap';
import { toast } from 'react-toastify';
import apis from '@/apis';
import { getFirstSixChars } from '@/utils/address';
import BigNumber from 'bignumber.js';

interface HolderDistributeProps {
  tokenAddress: string;
}

interface HolderData {
  holderAddress: {
    name?: string;
    address: string;
  };
  balance: number;
  percent: number;
}

const totalSupply = new BigNumber(1000000000000000000000000000);

const HolderDistribute: React.FC<HolderDistributeProps> = ({
  tokenAddress,
}) => {
  const [holderDistributeData, setHolderDistributeData] = useState<
    HolderData[]
  >([]);

  const fetchHolderDistributeData = async () => {
    try {
      const response = await apis.tokenHolders.fetchListTokenHolders({
        tokenAddress,
        sortBy: 'balance',
        sortDirection: 'desc',
        page: 1,
        limit: 10,
      });
      if (response) {
        setHolderDistributeData(
          (response.items || []).map((item: any) => {
            const thisPercent = new BigNumber(item.balance)
              .dividedBy(totalSupply)
              .multipliedBy(100)
              .toFixed(4);
            return {
              ...item,
              percent: Number(thisPercent),
            };
          }),
        );
      }
    } catch (error) {
      toast.error('Get holder distribute data error');
    }
  };

  useEffect(() => {
    if (tokenAddress) {
      fetchHolderDistributeData();
    }
  }, [tokenAddress]);

  return (
    <Box className="holder-distribute">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text fontSize={16} fontWeight={500} lineHeight="22px" color="#FAF7ED">
          Holder distribution
        </Text>
        {/* <BubbleMap holder={holderDistributeData} /> */}
      </Box>
      <OrderedList pl={1} spacing="10px">
        {holderDistributeData.map((data, index) => (
          <ListItem
            key={index}
            fontSize={14}
            fontWeight={400}
            lineHeight="20px"
            color="#FAF7ED"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text>
                {data?.holderAddress?.name ||
                  getFirstSixChars(data?.holderAddress?.address)}
              </Text>
              <Text color="#AC65F3">
                {new BigNumber(data.percent).toFixed(2)}%
              </Text>
            </Box>
          </ListItem>
        ))}
      </OrderedList>
    </Box>
  );
};

export default HolderDistribute;

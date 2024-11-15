import useRoninPrice from '@/hooks/useRoninPrice';
import { formatLargeNumber } from '@/utils/number';
import { Box, Progress, Text } from '@chakra-ui/react';
import Big from 'big.js';
import React, { useEffect, useState } from 'react';

import { IoInformationCircleOutline } from 'react-icons/io5';
import { toast } from 'react-toastify';
import { getBondingCurveData } from '@/contract/integration';

interface BondingCurveProps {
  tokenAddress: string;
}

const BondingCurve: React.FC<BondingCurveProps> = ({ tokenAddress }) => {
  const [bondingCurve, setBondingCurve] = useState<{
    percent: number;
    gradMcap: number;
    ronReserve: number;
    tokenReserve: number;
  }>({
    percent: 1,
    gradMcap: 0,
    ronReserve: 0,
    tokenReserve: 0,
  });

  const { price: roninPrice } = useRoninPrice();

  const formatGradMCap = () => {
    if (roninPrice) {
      const price = new Big(bondingCurve.gradMcap).mul(new Big(roninPrice));
      return formatLargeNumber(new Big(price));
    }
    return '0';
  };

  const fetchBondingCurve = async () => {
    try {
      const response = await getBondingCurveData(tokenAddress);
      // const response = 55;
      if (response) {
        setBondingCurve(response);
      }
    } catch (error) {
      toast.error('Fetching bonding curve failed');
    }
  };

  useEffect(() => {
    if (tokenAddress) {
      fetchBondingCurve();
    }
  }, [tokenAddress]);

  return (
    <Box className="bonding-curve">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Text
          fontSize={16}
          fontWeight={400}
          lineHeight="22px"
          display="flex"
          gap={1}
          alignItems="center"
          color="#BEBDBA"
        >
          Bonding curve progress
          <IoInformationCircleOutline color="#FAF7ED" />
        </Text>
        <Text fontSize={14} fontWeight={500} lineHeight="20px" color="#AC65F3">
          {`(${bondingCurve.percent}%)`}
        </Text>
      </Box>
      <Box className="progress-bar">
        <Progress
          height="7px"
          borderRadius="20px"
          backgroundColor="#373738"
          value={+bondingCurve.percent}
          colorScheme="purple"
        />
      </Box>
      <Text fontSize={12} fontWeight={400} lineHeight="16px" color="#8A8986">
        When the market cap reaches ${formatGradMCap()} all the liquidity from
        the bonding curve will be deposited into Raydium and burned. Progression
        increases as the price goes up.
        <br />
        There are {formatLargeNumber(new Big(bondingCurve.tokenReserve))} tokens
        still available for sale in the bonding curve and there is{' '}
        {bondingCurve.ronReserve.toFixed(4)} RON in the bonding curve.
      </Text>
    </Box>
  );
};

export default BondingCurve;

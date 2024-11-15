import React, { useRef } from 'react';
import {
  Box,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from '@chakra-ui/react';

import BuyTab from './BuyTab';
import SellTab from './SellTab';

import { StyledTabContainer, StyledTabList } from './index.style';
import DiscussionSection from '../components/Discussion';

const BuySellContainer = ({
  tokenId,
  tokenAddress,
}: {
  tokenId: string;
  tokenAddress: string;
}) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <StyledTabContainer>
      <Tabs variant={'unstyled'}>
        <Box display={'flex'} justifyContent={'center'}>
          <StyledTabList>
            <Tab
              _selected={{
                color: '#FAF7ED',
                backgroundColor: '#3DD37C',
                border: '1px solid #949282',
              }}
            >
              Buy
            </Tab>
            <Tab
              _selected={{
                color: '#FAF7ED',
                backgroundColor: '#EA7257',
                border: '1px solid #949282',
              }}
            >
              Sell
            </Tab>
          </StyledTabList>
        </Box>
        <TabPanels>
          <TabPanel padding={0}>
            <BuyTab />
          </TabPanel>
          <TabPanel padding={0}>
            <SellTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
      {isMobile && (
        <>
          <Box ref={scrollRef} height={'24px'} />
          <DiscussionSection
            tokenAddress={tokenAddress}
            id={tokenId}
            isMobile={isMobile}
            startRef={scrollRef}
          />
        </>
      )}
    </StyledTabContainer>
  );
};

export default BuySellContainer;

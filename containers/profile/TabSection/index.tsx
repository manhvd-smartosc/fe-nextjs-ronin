import { Box, Tab, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import CoinCreateTab from './CoinCreatedTab';
import CoinHeldTab from './CoinHeldTab';

import { StyledTabList } from './index.style';
import RepliesTab from './RepliesTab';

const TabSection: React.FC = () => {
  return (
    <Box mt={40} p={'0px 100px'}>
      <Tabs variant={'unstyled'}>
        <Box display={'flex'} justifyContent={'center'}>
          <StyledTabList>
            <Tab _selected={{ color: '#FAF7ED', fontWeight: 700 }}>
              Coins held
            </Tab>
            {'|'}
            <Tab _selected={{ color: '#FAF7ED', fontWeight: 700 }}>
              Coin created
            </Tab>
            {'|'}
            <Tab _selected={{ color: '#FAF7ED', fontWeight: 700 }}>Replies</Tab>
            {'|'}
            <Tab _selected={{ color: '#FAF7ED', fontWeight: 700 }}>
              Notification
            </Tab>
          </StyledTabList>
        </Box>

        <TabPanels>
          <TabPanel>
            <CoinHeldTab />
          </TabPanel>
          <TabPanel>
            <CoinCreateTab />
          </TabPanel>
          <TabPanel>
            <RepliesTab />
          </TabPanel>
          <TabPanel>
            <Box></Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TabSection;

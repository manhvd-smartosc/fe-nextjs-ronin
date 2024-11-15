import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';
import React from 'react';
import { StyledTabList } from './index.style';
import CoinHeadTab from './CoinHeadTab';

const TabSection: React.FC = () => {
  return (
    <Box mt={40} p={'0px 100px'}>
      <Tabs variant={'unstyled'}>
        <Box display={'flex'} justifyContent={'center'}>
          <StyledTabList>
            <Tab _selected={{ color: '#FAF7ED', fontWeight: 700 }}>
              Coins head
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
            <CoinHeadTab />
          </TabPanel>
          <TabPanel>
            <p>Coin created!</p>
          </TabPanel>
          <TabPanel>
            <p>Replies!</p>
          </TabPanel>
          <TabPanel>
            <p>Notification!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TabSection;

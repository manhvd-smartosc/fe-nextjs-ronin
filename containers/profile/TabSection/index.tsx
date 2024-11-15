import {
  Box,
  Tab,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

import TokenCreateTab from './TokenCreatedTab';
import TokenHeldTab from './TokenHeldTab';
import RepliesTab from './RepliesTab';

import { StyledTabList } from './index.style';

const TabSection: React.FC = () => {
  const params = useParams<{ id: string }>();

  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });

  const userAddress = params?.id?.[0];
  const { data: session } = useSession({
    required: false,
  });

  const isMyProfile =
    !userAddress ||
    (userAddress && userAddress === session?.user.publicAddress);

  return (
    <Box
      mt={currentSize === 'small' ? '80px' : '120px'}
      p={{ base: '5px', md: '0px 100px' }}
    >
      <Tabs variant={'unstyled'}>
        <Box display={'flex'} justifyContent={'center'}>
          <StyledTabList>
            <Tab _selected={{ color: '#FAF7ED', fontWeight: 700 }}>
              Tokens Held
            </Tab>
            {'|'}
            <Tab _selected={{ color: '#FAF7ED', fontWeight: 700 }}>
              Tokens Created
            </Tab>
            {isMyProfile && '|'}
            <Tab
              hidden={!isMyProfile}
              _selected={{ color: '#FAF7ED', fontWeight: 700 }}
            >
              Replies
            </Tab>
          </StyledTabList>
        </Box>

        <TabPanels>
          <TabPanel px={{ base: 0, md: 4 }}>
            <TokenHeldTab />
          </TabPanel>
          <TabPanel px={{ base: 0, md: 4 }}>
            <TokenCreateTab />
          </TabPanel>
          <TabPanel px={{ base: 0, md: 4 }} hidden={!isMyProfile}>
            <RepliesTab />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TabSection;

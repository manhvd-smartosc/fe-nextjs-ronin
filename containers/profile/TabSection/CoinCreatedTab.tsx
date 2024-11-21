import React from 'react';
import { Box, Button, Grid, Flex } from '@chakra-ui/react';
import { IoEyeOff } from 'react-icons/io5';
import { coinCreateFakeData } from './fakedata';
import Pagination from '@/components/Pagination';
import CoinCreatedCard from '@/components/CoinCreatedCard';

const CoinCreateTab = () => {
  return (
    <Box p={4} borderRadius="lg">
      <Flex justify="space-between" align="center" mb={4}>
        <Button
          leftIcon={<IoEyeOff />}
          size="sm"
          color="#AC65F3"
          variant="link"
          fontSize={14}
          fontWeight={700}
          lineHeight={'20px'}
        >
          Hide dust token
        </Button>
      </Flex>

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {coinCreateFakeData.map((item, index) => (
          <CoinCreatedCard data={item} />
        ))}
      </Grid>

      <Pagination totalPages={2} currentPage={1} onPageChange={() => {}} />
    </Box>
  );
};

export default CoinCreateTab;

import React from 'react';
import { Box, Button, Grid, Flex } from '@chakra-ui/react';
import { IoEyeOff } from 'react-icons/io5';
import Pagination from '@/components/Pagination';
import CoinHeldCard from '@/components/CoinHeldCard';
import { coinHeadFakeData } from './fakedata';

const CoinHeldTab = () => {
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
          md: 'repeat(4, 1fr)',
        }}
        gap={4}
      >
        {coinHeadFakeData.map((item, index) => (
          <CoinHeldCard
            name={item.name}
            quantity={item.quantity}
            value={item.value}
            imageUrl={item.image}
            onRefresh={() => {}}
          />
        ))}
      </Grid>

      <Pagination totalPages={2} currentPage={1} onPageChange={() => {}} />
    </Box>
  );
};

export default CoinHeldTab;

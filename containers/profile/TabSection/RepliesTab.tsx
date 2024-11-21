import React from 'react';
import { Box, Grid, Flex, Text } from '@chakra-ui/react';
import Pagination from '@/components/Pagination';
import { repliesFakeData } from './fakedata';
import ReplyCard from '@/components/ReplyCard';

const RepliesTab = () => {
  return (
    <Box p={4} borderRadius="lg">
      <Flex justify="space-between" align="center" mb={4}>
        <Text>Only you can view your profile</Text>
      </Flex>

      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {repliesFakeData.map((item, index) => (
          <ReplyCard data={item} />
        ))}
      </Grid>

      <Pagination totalPages={2} currentPage={1} onPageChange={() => {}} />
    </Box>
  );
};

export default RepliesTab;

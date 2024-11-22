import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Flex, Spinner } from '@chakra-ui/react';
import { IoEyeOff } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import apis from '@/apis';
import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import TokenContainer from '@/components/TokenContainer';

export type TokenType = {
  address: string;
  createdAt: string;
  createdBy: string;
  description: string;
  id: string;
  imageUrl: string;
  lastBuy: string | null;
  lastComment: string | null;
  lastMcap: string;
  lastPrice: string;
  name: string;
  poolId: string | null;
  telegramUrl: string | null;
  ticker: string;
  twitterUrl: string;
  websiteUrl: string;
};

const CoinCreateTab = () => {
  const [listToken, setListToken] = useState<Array<TokenType>>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const getListToken = async () => {
    try {
      setLoading(true);
      const data = await apis.token.fetchTokenList({
        page: pagination.page,
        limit: DEFAULT_ITEMS_PER_PAGE,
      });
      setPagination({ ...pagination, totalPages: data?.pagination.pagesCount });
      setListToken(data?.items);
      setLoading(false);
    } catch (error) {
      toast.error('Get list token error');
    }
  };

  const handleChangePage = (page: number) => {
    setPagination({ ...pagination, page });
  };

  useEffect(() => {
    getListToken();
  }, [pagination.page]);

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
        {listToken.map((token, index) => (
          <TokenContainer key={index} token={token} />
        ))}
      </Grid>
      {!!pagination?.totalPages && (
        <Pagination
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          onPageChange={handleChangePage}
        />
      )}
    </Box>
  );
};

export default CoinCreateTab;

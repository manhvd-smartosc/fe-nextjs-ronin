import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Flex, Spinner } from '@chakra-ui/react';
import { IoEyeOff } from 'react-icons/io5';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import apis from '@/apis';
import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import TokenContainer, { TokenType } from '@/components/TokenContainer';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { create } from 'domain';

const CoinCreateTab = () => {
  const [listToken, setListToken] = useState<Array<TokenType>>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const { data: session } = useSession({
    required: false,
  });
  const params = useParams();

  const getListToken = async () => {
    let createdBy = '';
    if (!createdBy && params?.id) createdBy = params.id[0];
    if (!createdBy) createdBy = session?.user?.publicAddress;
    if (!createdBy) return;

    try {
      setLoading(true);
      const data = await apis.token.fetchTokenList({
        page: pagination.page,
        limit: DEFAULT_ITEMS_PER_PAGE,
        createdBy: createdBy,
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
  }, [pagination.page, params?.id, session]);

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
          background={'transparent'}
        >
          Hide dust token
        </Button>
      </Flex>
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          lg: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
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

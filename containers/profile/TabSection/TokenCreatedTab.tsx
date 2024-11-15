import React, { useEffect, useState } from 'react';
import { Box, Grid, useBreakpointValue } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import apis from '@/apis';
import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import TokenContainer, { TokenType } from '@/components/TokenContainer';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';

const TokenCreateTab = () => {
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

  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });

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
      <Grid
        templateColumns={{
          base: 'repeat(1, 1fr)',
          lg: 'repeat(2, 1fr)',
          xl: 'repeat(3, 1fr)',
        }}
        gap={4}
      >
        {listToken.map((token, index) => (
          <TokenContainer key={index} token={token} shake={false} />
        ))}
      </Grid>

      {!!pagination?.totalPages && (
        <Box
          display="flex"
          justifyContent={currentSize === 'small' ? 'center' : 'flex-end'}
        >
          <Pagination
            totalPages={pagination.totalPages}
            currentPage={pagination.page}
            onPageChange={handleChangePage}
          />
        </Box>
      )}
    </Box>
  );
};

export default TokenCreateTab;

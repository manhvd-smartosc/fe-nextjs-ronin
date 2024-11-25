import React, { useEffect, useState } from 'react';
import { Box, Grid } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Pagination from '@/components/Pagination';
import CoinHeldCard from '@/components/CoinHeldCard';
import { TokenType } from '@/components/TokenContainer';

import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import { toast } from 'react-toastify';

const CoinHeldTab = () => {
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
    try {
      //TODO: fetch token list
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
        {listToken.map((item, index) => (
          <CoinHeldCard token={item} onRefresh={() => {}} />
        ))}
      </Grid>

      {!!listToken.length && (
        <Pagination
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          onPageChange={handleChangePage}
        />
      )}
    </Box>
  );
};

export default CoinHeldTab;

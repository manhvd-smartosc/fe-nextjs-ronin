import React, { useEffect, useState } from 'react';
import { Box, Grid, useBreakpointValue } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import Pagination from '@/components/Pagination';
import TokenHeldCard from '@/components/TokenHeldCard';

import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import {
  checkTokenBalance,
  getQuantityRonsByToken,
  getQuantityTokensByRonBatch,
} from '@/contract/integration';
import apis from '@/apis';

const TokenHeldTab = () => {
  const [listToken, setListToken] = useState<Array<any>>([]);
  const [listRonPrice, setListRonPrice] = useState<Array<any>>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const userAddress = params?.id?.[0];
  const { data: session } = useSession({
    required: false,
  });
  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });

  const getListToken = async () => {
    if (!userAddress && !session?.user.publicAddress) {
      return;
    }
    try {
      let holderAddress = userAddress;
      if (!holderAddress && session) {
        holderAddress = session.user?.publicAddress;
      }

      setLoading(true);
      const response = await apis.tokenHolders.fetchListTokenHolders({
        holderAddress,
        sortBy: 'balance',
        sortDirection: 'desc',
        page: pagination.page,
        limit: DEFAULT_ITEMS_PER_PAGE,
      });
      if (response) {
        const tokens = response.items.map((item: any) => ({
          tokenAddress: item.token.address,
          amount: item.balance,
        }));
        const ronPriceData = await getQuantityTokensByRonBatch(tokens);
        if (ronPriceData?.length) {
          setListRonPrice(ronPriceData);
        }

        setListToken(response.items);
        setPagination({
          page: response.pagination.currentPage,
          totalPages: response.pagination.pagesCount,
        });
      }
      setLoading(false);
    } catch (error) {
      toast.error('Get list token error');
    }
  };

  const handleRefreshBalance = async ({
    tokenAddress,
  }: {
    tokenAddress: string;
  }) => {
    try {
      const balance = await checkTokenBalance({
        address: userAddress,
        tokenAddress,
      });
      const ronValue = await getQuantityRonsByToken(
        tokenAddress,
        balance.toString(),
      );
      return {
        balance: balance ?? 0,
        ronValue: ronValue ?? 0,
      };
    } catch (error) {
      toast.error('Refresh balance error');
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
          xl: 'repeat(4, 1fr)',
        }}
        gap={4}
      >
        {listToken.map((item, index) => (
          <TokenHeldCard
            key={index}
            token={item}
            onRefresh={handleRefreshBalance}
            listRonPrice={listRonPrice}
          />
        ))}
      </Grid>

      {!!listToken.length && (
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

export default TokenHeldTab;

import { useEffect, useState } from 'react';
import { Box, Grid, Spinner } from '@chakra-ui/react';
import { toast } from 'react-toastify';

import BackgroundContent from '@/assets/images/background-content.png';
import { DEFAULT_ITEMS_PER_PAGE, SORT_OPTIONS, SORT_TYPES } from '@/constants';
import CustomSelect from '@/components/CustomSelect/index';
import Pagination from '@/components/Pagination';
import CustomSearchInput from '@/components/CustomSearchInput';
import api from '@/apis';
import BackgroundCover from './BackgroundCover';
import { StyledHomeContainer } from './index.style';
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

interface Option {
  label: string;
  value: string;
}

const Home = () => {
  const [listToken, setListToken] = useState<Array<TokenType>>([]);
  const [filter, setFilter] = useState({
    sortBy: 'createdAt',
    searchTerm: '',
    sortDirection: 'desc',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const getListToken = async () => {
    try {
      setLoading(true);
      const data = await api.token.fetchTokenList({
        searchTerm: filter.searchTerm,
        sortDirection: filter.sortDirection,
        sortBy: filter.sortBy,
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

  const handleChangeSelectSort = (sortName: Option) => {
    setFilter({ ...filter, sortBy: sortName.value });
  };

  const handleChangeSelectSortType = (sortType: Option) => {
    setFilter({ ...filter, sortDirection: sortType.value });
  };

  const handleChangeSearch = (searchTerm: string) => {
    setFilter({ ...filter, searchTerm });
  };

  const handleChangePage = (page: number) => {
    setPagination({ ...pagination, page });
  };

  useEffect(() => {
    getListToken();
  }, [filter, pagination.page]);

  return (
    <StyledHomeContainer>
      <BackgroundCover />
      <Box bgColor="#1A1A1A" gap="24px" borderRadius="40px" margin="0 auto">
        <Box position="relative">
          <Box
            position="relative"
            top="0"
            w="100%"
            padding={{ base: '10px', sm: '32px 80px' }}
            bgImage={`url(${BackgroundContent.src})`}
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="flex-start"
              marginBottom={30}
              gap={6}
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <CustomSelect
                prefix="sort"
                options={SORT_OPTIONS}
                onChange={handleChangeSelectSort}
              />
              <CustomSelect
                prefix="order"
                options={SORT_TYPES}
                onChange={handleChangeSelectSortType}
              />
              <CustomSearchInput onSearch={handleChangeSearch} />
            </Box>
            {loading ? (
              <Spinner transitionDuration="0.8s" />
            ) : (
              <>
                <Box display="flex" alignItems="center" justifyContent="center">
                  <Grid
                    templateColumns={{
                      base: 'repeat(1, 1fr)',
                      lg: 'repeat(2, 1fr)',
                      xl: 'repeat(3, 1fr)',
                    }}
                    gap={6}
                  >
                    {listToken?.map((token, index) => (
                      <TokenContainer key={index} token={token} />
                    ))}
                  </Grid>
                </Box>
                {!!pagination?.totalPages && (
                  <Pagination
                    totalPages={pagination.totalPages}
                    currentPage={pagination.page}
                    onPageChange={handleChangePage}
                  />
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>
    </StyledHomeContainer>
  );
};

export default Home;

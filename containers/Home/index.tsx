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
import TokenContainer, { TokenType } from '@/components/TokenContainer';

interface Option {
  label: string;
  value: string;
}

const Home = () => {
  const [listToken, setListToken] = useState<Array<TokenType>>([]);
  const [filter, setFilter] = useState({
    sortBy: 'lastMcap',
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
        sortBy: filter.sortBy === 'featured' ? 'createdAt' : filter.sortBy,
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
    let sortDirection = filter.sortDirection;
    if (sortName.value === 'featured') {
      sortDirection = 'desc';
    }
    setFilter({ ...filter, sortBy: sortName.value, sortDirection });
    setPagination({ ...pagination, page: 1 });
  };

  const handleChangeSelectSortType = (sortType: Option) => {
    setFilter({ ...filter, sortDirection: sortType.value });
    setPagination({ ...pagination, page: 1 });
  };

  const handleChangeSearch = (searchTerm: string) => {
    setFilter({ ...filter, searchTerm });
    setPagination({ ...pagination, page: 1 });
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
              marginBottom={{ base: '10px', md: '30px' }}
              gap={{ base: 2, md: 6 }}
              flexDirection={{ base: 'column', md: 'row' }}
            >
              <CustomSelect
                prefix="sort"
                options={SORT_OPTIONS}
                onChange={handleChangeSelectSort}
              />
              {filter.sortBy !== 'featured' && (
                <CustomSelect
                  width="150px"
                  prefix="order"
                  options={SORT_TYPES}
                  onChange={handleChangeSelectSortType}
                />
              )}

              <CustomSearchInput onSearch={handleChangeSearch} />
            </Box>
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
          </Box>
        </Box>
      </Box>
    </StyledHomeContainer>
  );
};

export default Home;

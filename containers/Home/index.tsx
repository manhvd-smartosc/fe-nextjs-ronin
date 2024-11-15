'use client';
import { useEffect, useState, useCallback } from 'react';
import { Box, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import Big from 'big.js';

import BackgroundContent from '@/assets/images/background-content.png';
import { DEFAULT_ITEMS_PER_PAGE, SORT_OPTIONS, SORT_TYPES } from '@/constants';
import CustomSelect from '@/components/CustomSelect/index';
import Pagination from '@/components/Pagination';
import CustomSearchInput from '@/components/CustomSearchInput';
import { socketEmitter, AppSyncEventType } from '@/lib-client/EventEmitter';

import type {
  TokenEventData,
  TradeEventData,
  CommentEventData,
} from '@/lib-client/EventEmitter';

import api from '@/apis';
import BackgroundCover from './BackgroundCover';
import { StyledHomeContainer } from './index.style';
import TokenContainer, { TokenType } from '@/components/TokenContainer';

interface Option {
  label: string;
  value: string;
}

const SHAKE_DURATION = 500;

const Home = () => {
  const [listToken, setListToken] = useState<Array<TokenType>>([]);
  const [shakeCards, setShakeCards] = useState<string[]>([]);
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

  const currentSize = useBreakpointValue({
    base: 'small',
    md: 'medium',
    lg: 'large',
    xl: 'extra large',
  });

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
    } catch (error) {
      toast.error('Get list token error');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeSelectSort = (sortName: Option) => {
    let sortDirection = filter.sortDirection;
    if (sortName.value === 'lastFeatured') {
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

  const tryFilterSearchTerm = (
    type: AppSyncEventType,
    data: TokenEventData | TradeEventData | CommentEventData,
  ) => {
    const { searchTerm } = filter;
    if (!searchTerm) {
      return true;
    }
    const lowerCaseSearchTerm = searchTerm?.toLowerCase() || '';
    let name = '',
      description = '',
      ticker = '',
      address = '';
    switch (type) {
      case AppSyncEventType.TOKEN_CREATED:
        name = (data as TokenEventData)?.name;
        description = (data as TokenEventData)?.description;
        ticker = (data as TokenEventData)?.ticker;
        address = (data as TokenEventData)?.address;
        break;
      case AppSyncEventType.TRADE:
        name = (data as TradeEventData)?.token?.name;
        description = (data as TradeEventData)?.token?.description;
        ticker = (data as TradeEventData)?.token?.ticker;
        address = (data as TradeEventData)?.token?.address;
        break;
      case AppSyncEventType.COMMENT:
        name = (data as CommentEventData)?.token?.name;
        description = (data as CommentEventData)?.token?.description;
        ticker = (data as CommentEventData)?.token?.ticker;
        address = (data as CommentEventData)?.token?.address;
        break;
      default:
        return false;
    }
    return (
      name?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
      description?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
      ticker?.toLowerCase()?.includes(lowerCaseSearchTerm) ||
      address?.toLowerCase()?.includes(lowerCaseSearchTerm)
    );
  };

  const tryAppendAndSort = useCallback(
    (prevList: TokenType[], tokenData: TokenEventData) => {
      const { sortBy, sortDirection } = filter;
      const { page, totalPages } = pagination;
      const tokenAddress = tokenData.address.toLowerCase();
      const findToken = (prevList || []).find(
        (thisToken) => thisToken.address.toLowerCase() === tokenAddress,
      );
      let newListToken = [];
      const tmpToken = {
        address: tokenData.address,
        createdAt: tokenData.createdAt,
        createdBy: tokenData.createdBy,
        description: tokenData.description,
        imageUrl: tokenData.imageUrl,
        lastBuy: tokenData.lastBuy,
        lastComment: tokenData.lastComment,
        lastMcap: tokenData.lastMcap,
        lastPrice: tokenData.lastPrice,
        lastFeatured: tokenData.lastFeatured,
        name: tokenData.name,
        poolId: tokenData.poolId,
        telegramUrl: tokenData.telegramUrl,
        ticker: tokenData.ticker,
        twitterUrl: tokenData.twitterUrl,
        websiteUrl: tokenData.websiteUrl,
        totalComments: tokenData.totalComments,
        User: {
          avatarUrl: tokenData?.creator?.avatarUrl,
          name: tokenData?.creator?.name,
          address: tokenData?.creator?.address,
        },
      } as TokenType;
      if (findToken) {
        // check if included inside current page => update and sort
        newListToken = [
          ...prevList.filter(
            (thisToken) => thisToken.address.toLowerCase() !== tokenAddress,
          ),
          tmpToken,
        ];
      } else {
        // not in current page
        if (sortBy === 'lastFeatured' && page !== 1) {
          // - sortBy = featured:
          //  - not append if page != 1
          return { shouldUpdate: false, newListToken: [] };
        }
        if (sortDirection === 'asc' && page !== Math.max(totalPages, 1)) {
          // - sortDirection = asc:
          //  - not append if (page != Max(total page, 1))
          return { shouldUpdate: false, newListToken: [] };
        }
        if (sortDirection === 'desc' && page !== 1) {
          // - sortDirection = desc:
          //  - not append if page != 1
          return { shouldUpdate: false, newListToken: [] };
        }
        newListToken = [...(prevList || []), tmpToken];
      }

      let sortByAttr = '' as keyof typeof tmpToken;
      switch (sortBy) {
        case 'lastMcap':
          sortByAttr = 'lastMcap';
          break;
        case 'createdAt':
          sortByAttr = 'createdAt';
          break;
        case 'lastBuy':
          sortByAttr = 'lastBuy';
          break;
        case 'lastComment':
          sortByAttr = 'lastComment';
          break;
        case 'lastFeatured':
          sortByAttr = 'lastFeatured';
          break;
        default:
          sortByAttr = 'createdAt';
      }
      // sort
      newListToken = newListToken.sort((a, b) => {
        const aVal = new Big(a[sortByAttr] || 0);
        const bVal = new Big(b[sortByAttr] || 0);
        if (sortDirection === 'asc') {
          return aVal.cmp(bVal);
        }
        return bVal.cmp(aVal);
      });
      const dataNewList = [...newListToken].slice(0, DEFAULT_ITEMS_PER_PAGE);
      return {
        shouldUpdate: true,
        newListToken: dataNewList,
      };
    },
    [filter, pagination, listToken],
  );

  // watching events
  useEffect(() => {
    const handleCreate = (data: any) => {
      const shouldAllow = tryFilterSearchTerm(
        AppSyncEventType.TOKEN_CREATED,
        data,
      );
      if (!shouldAllow) {
        return;
      }
      setListToken((prevList) => {
        const { shouldUpdate, newListToken } = tryAppendAndSort(prevList, data);
        if (shouldUpdate) {
          const tokenDataAddress = data.address.toLowerCase();
          // setListToken([...newListToken]);
          setShakeCards((prev) => [tokenDataAddress, ...prev]);
          setTimeout(() => {
            const temp = shakeCards.filter((card) => card !== tokenDataAddress);
            setShakeCards(temp);
          }, SHAKE_DURATION);
          return [...newListToken];
        }
        return prevList;
      });
    };
    const handleTrading = (data: any) => {
      const tokenData = data.token;
      const shouldAllow = tryFilterSearchTerm(AppSyncEventType.TRADE, data);

      if (!shouldAllow) {
        return;
      }
      setListToken((prevList) => {
        const { shouldUpdate, newListToken } = tryAppendAndSort(
          prevList,
          tokenData,
        );
        if (shouldUpdate) {
          const tokenDataAddress = tokenData.address.toLowerCase();
          // setListToken([...newListToken]);
          setShakeCards((prev) => [tokenDataAddress, ...prev]);
          setTimeout(() => {
            const temp = shakeCards.filter((card) => card !== tokenDataAddress);
            setShakeCards(temp);
          }, SHAKE_DURATION);
          return [...newListToken];
        }
        return prevList;
      });
    };
    const handleComment = (data: any) => {
      const tokenData = data.token;
      const shouldAllow = tryFilterSearchTerm(AppSyncEventType.TRADE, data);

      if (!shouldAllow) {
        return;
      }
      setListToken((prevList) => {
        const { shouldUpdate, newListToken } = tryAppendAndSort(
          prevList,
          tokenData,
        );
        if (shouldUpdate) {
          const tokenDataAddress = tokenData.address.toLowerCase();
          setShakeCards((prev) => [tokenDataAddress, ...prev]);
          setTimeout(() => {
            const temp = shakeCards.filter((card) => card !== tokenDataAddress);
            setShakeCards(temp);
          }, SHAKE_DURATION);
          return [...newListToken];
        }
        return prevList;
      });
    };

    if (!loading) {
      socketEmitter.on(AppSyncEventType.TOKEN_CREATED, handleCreate);
      socketEmitter.on(AppSyncEventType.TRADE, handleTrading);
      socketEmitter.on(AppSyncEventType.COMMENT, handleComment);
    }
    return () => {
      if (socketEmitter) {
        socketEmitter.off(AppSyncEventType.TOKEN_CREATED, handleCreate);
        socketEmitter.off(AppSyncEventType.TRADE, handleTrading);
        socketEmitter.off(AppSyncEventType.COMMENT, handleComment);
      }
    };
  }, [loading]);

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
              {filter.sortBy !== 'lastFeatured' && (
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
                w="100%"
              >
                {listToken?.map((token) => (
                  <GridItem w="100%" key={JSON.stringify(token)}>
                    <TokenContainer
                      token={token}
                      shake={shakeCards.includes(token.address.toLowerCase())}
                    />
                  </GridItem>
                ))}
              </Grid>
            </Box>
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
        </Box>
      </Box>
    </StyledHomeContainer>
  );
};

export default Home;

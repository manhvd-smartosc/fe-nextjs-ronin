'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  Box,
  Button,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { IoArrowBackOutline } from 'react-icons/io5';
import Big from 'big.js';
import Head from 'next/head';
import { debounce } from 'lodash';

import apis from '@/apis';
import BackgroundContent from '@/assets/images/background-details.png';
import CopyIcon from '@/assets/icons/copy.svg';
import { Token } from '@prisma/client';
import useRoninPrice from '@/hooks/useRoninPrice';
import { calculateLastMCap } from '@/utils/fee';
import { formatLargeNumber } from '@/utils/number';
import { shortenAddress } from '@/utils/address';
import { AppSyncEventType, socketEmitter } from '@/lib-client/EventEmitter';

import Loading from '@/components/Loading';
import BuySellContainer from './BuySell';
import BondingCurve from './components/BondingCurve';
import HolderDistribute from './components/HolderDistribute';
import TokenInfo from './components/TokenInfo';
import TradesTable from './components/TradesTable';
import TradingChart from './components/TradingChart';
import SummaryInfo from './components/SummaryInfo';
import DiscussionSection from './components/Discussion';

import { StyledTokenMobileWrapper, StyledTokenPage } from './index.style';

const TokenDetail: React.FC = () => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const { address } = router.query;

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [tokenDetail, setTokenDetail] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);

  const { price: roninPrice } = useRoninPrice();

  const formatLastMCap = (marketCapInRon: string) => {
    if (roninPrice) {
      const price = calculateLastMCap(marketCapInRon, roninPrice);
      return formatLargeNumber(new Big(price));
    }
    return '0';
  };

  const fetchTokenDetail = useCallback(
    async (shouldLoading = true, thisTokenAddress = '') => {
      const queryAddress =
        thisTokenAddress || (Array.isArray(address) ? address?.[0] : address);
      if (!queryAddress && router.isReady) {
        router.push('/');
        return;
      }

      try {
        if (shouldLoading) {
          setLoading(true);
        }
        if (!queryAddress) {
          return;
        }
        const data = await apis.token.getTokenDetail(queryAddress as string);
        if (!data || !data.address) {
          toast.error(data?.message);
          router.push('/');
          return;
        }
        setTokenDetail(data);
      } catch (error: any) {
        toast.error(error?.message);
      } finally {
        if (shouldLoading) {
          setLoading(false);
        }
      }
    },
    [address],
  );

  useEffect(() => {
    if (router.isReady) {
      fetchTokenDetail();
    }
  }, [address, router.isReady]);

  const debouncedFetchTokenDetail = useRef(
    debounce(
      async (thisTokenAddress: string) => {
        await fetchTokenDetail(false, thisTokenAddress);
      },
      500,
      { leading: false, trailing: true },
    ),
  ).current;

  // watching events
  useEffect(() => {
    const handleTrading = async (data: any) => {
      const tokenData = data.token;
      const shouldAllow =
        tokenData?.address?.toLowerCase() ===
        tokenDetail?.address?.toLowerCase();

      if (!shouldAllow) {
        return;
      }

      // emit data trade
      socketEmitter.emit(
        `${tokenDetail?.address?.toLowerCase()}_${AppSyncEventType.TRADE}`,
        data,
      );
      await debouncedFetchTokenDetail(tokenDetail?.address?.toLowerCase()!);
    };

    const handleComment = async (data: any) => {
      const tokenData = data.token;
      const shouldAllow =
        tokenData?.address?.toLowerCase() ===
        tokenDetail?.address?.toLowerCase();

      if (!shouldAllow) {
        return;
      }

      // emit data comment
      socketEmitter.emit(
        `${tokenDetail?.address?.toLowerCase()}_${AppSyncEventType.COMMENT}`,
        data,
      );
      await debouncedFetchTokenDetail(tokenDetail?.address?.toLowerCase()!);
    };

    if (!loading && tokenDetail?.address) {
      socketEmitter.on(AppSyncEventType.TRADE, handleTrading);
      socketEmitter.on(AppSyncEventType.COMMENT, handleComment);
    }

    return () => {
      if (socketEmitter) {
        socketEmitter.off(AppSyncEventType.TRADE, handleTrading);
        socketEmitter.off(AppSyncEventType.COMMENT, handleTrading);
      }
    };
  }, [loading, tokenDetail?.address]);

  if (loading) {
    return <Loading />;
  }

  if (!tokenDetail) {
    return (
      <StyledTokenPage>
        <Text fontSize={'3xl'} textAlign={'center'} margin={'auto'}>
          Token not found
        </Text>
      </StyledTokenPage>
    );
  }

  return (
    <StyledTokenPage
      className={`${isMobile ? 'mobile' : ''}`}
      bgImage={`url(${BackgroundContent.src})`}
      bgSize="cover"
    >
      <Box className="header" display="flex">
        <Box>
          <Button
            height="40px"
            width="40px"
            className="back-button"
            leftIcon={<IoArrowBackOutline />}
            variant="unstyled"
            onClick={() => {
              router.push('/');
            }}
          />
        </Box>
        <Text>Details</Text>
      </Box>

      <Box className="token-detail-wrap" hidden={isMobile}>
        <Box className="chart-comments-section">
          <SummaryInfo
            key={`${tokenDetail.lastMcap}_${tokenDetail.lastComment}`}
            data={tokenDetail}
          />
          <Box className="chart-section">
            <TradingChart
              address={tokenDetail.address as string}
              createdAt={Number(tokenDetail.createdAt)}
              initPrice={new Big(tokenDetail.initPrice).div(1e18).toNumber()}
            />
            <Box ref={scrollRef} />
          </Box>
          <Box className="comments-section">
            <Tabs>
              <Box>
                <TabList className="tab-list">
                  {['Thread', 'Trades'].map((tab) => (
                    <Tab
                      _selected={{
                        fontWeight: '700 !important',
                        color: '#faf7ed !important',
                        borderBottom: '3px solid #faf7ed !important',
                      }}
                      key={tab}
                      className="tab-list-button"
                    >
                      {tab}
                    </Tab>
                  ))}
                </TabList>
              </Box>
              <TabPanels mt={'24px'}>
                <TabPanel padding={0}>
                  <DiscussionSection
                    tokenAddress={tokenDetail.address as string}
                    id={tokenDetail.id.toString(10)}
                    startRef={scrollRef}
                  />
                </TabPanel>
                <TabPanel padding={0}>
                  <TradesTable
                    tokenId={tokenDetail.id.toString() || ''}
                    tokenName={tokenDetail.ticker || ''}
                    tokenAddress={tokenDetail.address || ''}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Box>
        <Box className="sell-buy-section">
          <BuySellContainer
            tokenId={tokenDetail.id.toString()}
            tokenAddress={tokenDetail.address as string}
          />
          <Box className="address">
            <Text>{tokenDetail.address || ''}</Text>
            <Image
              src={CopyIcon.src}
              boxSize="24px"
              cursor="pointer"
              onClick={() => {
                navigator.clipboard.writeText(
                  (tokenDetail.address as string) || '',
                );
                toast.success('Address copied to clipboard!');
              }}
            />
          </Box>
          <TokenInfo token={tokenDetail as Token} />
          <BondingCurve
            key={tokenDetail.lastMcap}
            tokenAddress={address?.[0] as string}
          />
          <HolderDistribute tokenAddress={address?.[0] as string} />
        </Box>
      </Box>

      <StyledTokenMobileWrapper hidden={!isMobile}>
        <Tabs variant={'unstyled'}>
          <TabPanels p="15px 20px" minHeight="100vh">
            <TabPanel padding={0}>
              <TokenInfo token={tokenDetail as Token} />
              <BondingCurve tokenAddress={address?.[0] as string} />
              <HolderDistribute tokenAddress={address?.[0] as string} />
            </TabPanel>
            <TabPanel padding={0}>
              <Text
                fontSize={14}
                fontWeight={500}
                lineHeight={'20px'}
                color="#3DD37C"
              >
                Market cap: $
                {formatLastMCap(tokenDetail.lastMcap.toString() || '0')}
              </Text>
              <Box className="chart-section">
                <TradingChart
                  address={tokenDetail.address as string}
                  createdAt={Number(tokenDetail.createdAt)}
                  initPrice={new Big(tokenDetail.initPrice).div(1e18).toNumber()}
                />
              </Box>
            </TabPanel>
            <TabPanel padding={0}>
              <Box className="address">
                <Text>
                  {isMobile
                    ? shortenAddress(tokenDetail.address, 15)
                    : tokenDetail.address}
                </Text>
                <Image
                  src={CopyIcon.src}
                  boxSize="24px"
                  cursor="pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(tokenDetail.address);
                    toast.success('Address copied to clipboard!');
                  }}
                />
              </Box>
              <BuySellContainer
                tokenId={tokenDetail.id.toString()}
                tokenAddress={tokenDetail.address as string}
              />
            </TabPanel>
            <TabPanel padding={0}>
              <TradesTable
                tokenId={tokenDetail.id.toString()}
                tokenName={tokenDetail.ticker || ''}
                tokenAddress={tokenDetail.address}
              />
            </TabPanel>
          </TabPanels>
          <Box
            display={'flex'}
            justifyContent={'center'}
            position="sticky"
            bottom={0}
            zIndex={1000}
            onClick={() => {
              window.scrollTo(0, 0);
            }}
          >
            <TabList className="tab-list-mobile">
              {['info', 'chart', 'buy/sell', 'tsx'].map((tab) => (
                <Tab
                  key={tab}
                  className="tab-list-button"
                  _selected={{
                    borderTop: '2px solid #ac65f3',
                    boxShadow: '0px -2px 3px 3px #ffffff1f inset',
                    color: '#faf7ed',
                  }}
                >
                  {tab}
                </Tab>
              ))}
            </TabList>
          </Box>
        </Tabs>
      </StyledTokenMobileWrapper>
    </StyledTokenPage>
  );
};

export default TokenDetail;

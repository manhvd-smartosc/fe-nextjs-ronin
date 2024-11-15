'use client';

import { useEffect, useState } from 'react';
import {
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Image,
  Text,
  Link,
} from '@chakra-ui/react';
import apis from '@/apis';
import { getDifferenceTime } from '@/utils';
import { AppSyncEventType, socketEmitter } from '@/lib-client/EventEmitter';
import { getFirstSixChars } from '@/utils/address';
import { ROUTE } from '@/constants';

import Pagination from '@/components/Pagination';
import AvatarImage from '@/assets/images/pepe.png';

import { StyledTradesTable } from '../index.style';
import { formatLargeNumber } from '@/utils/number';
import Big from 'big.js';

const tableHeaders = [
  {
    key: 'account',
    value: 'ACCOUNT',
    align: 'left',
    style: { borderRadius: '12px 0 0 0' },
  },
  { key: 'type', value: 'TYPE', align: 'left' },
  { key: 'ron', value: 'RON', align: 'left' },
  { key: 'tokenAmount', value: '', align: 'left' },
  { key: 'date', value: 'DATE', align: 'left' },
  {
    key: 'transactionId',
    value: 'TRANSACTION',
    align: 'right',
    style: { borderRadius: '0 12px 0 0' },
  },
];
const SHAKE_DURATION = 500;

const TradesTable = ({
  tokenId,
  tokenName,
  tokenAddress,
}: {
  tokenId: string;
  tokenName: string;
  tokenAddress: string;
}) => {
  const [listTrades, setListTrades] = useState<any[]>([]);
  const [shakeCards, setShakeCards] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
  });

  const fetchTrades = async () => {
    try {
      setLoading(true);
      const response = await apis.trade.fetchListTrade({
        tokenId,
        page: pagination.page,
        limit: 10,
      });
      if (response) {
        const formattedData = response.items.map((item: any) => ({
          ...item,
          account: item.user?.name,
          ron: Number(+item.ronAmount).toFixed(2),
          tokenAmount: Number(+item.tokenAmount).toFixed(2),
          date: getDifferenceTime(item.createdAt),
          type: item.type === 'BUY' ? 'Buy' : 'Sell',
          transactionId: item.transactionHash?.slice(0, 6),
        }));
        setListTrades(formattedData);
        setPagination({
          page: response.pagination.currentPage,
          totalPages: response.pagination.pagesCount,
        });
      }
    } catch (error) {
      // toast.error('Fetch list trade failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tokenId) {
      fetchTrades();
    }
  }, [tokenId, pagination.page]);

  const handleChangePage = (page: number) => {
    setPagination({ ...pagination, page });
  };

  const renderData = (key: string, trade: any) => () => {
    switch (key) {
      case 'account':
        return (
          <Link
            variant="unstyled"
            href={`${ROUTE.PROFILE}/${trade?.user?.address || ''}`}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <Image
                w="20px"
                h="20px"
                borderRadius="50%"
                src={trade?.user?.avatarUrl || AvatarImage.src}
                alt="avatar"
              />
              <Text fontSize={14} fontWeight={500}>
                {trade.account || getFirstSixChars(trade?.user?.address)}
              </Text>
            </Box>
          </Link>
        );
      case 'type':
        return (
          <Text
            color={trade.type === 'Sell' ? '#EA7257' : '#3DD37C'}
            fontWeight={500}
          >
            {trade.type}
          </Text>
        );
      case 'transactionId':
        return (
          <Link
            variant="unstyled"
            href={`${process.env.NEXT_PUBLIC_EXPLORER_URL}/tx/${
              trade?.transactionHash || ''
            }`}
            isExternal
          >
            <Text
              _hover={{
                textDecoration: 'underline',
              }}
            >
              {trade.transactionId}
            </Text>
          </Link>
        );
      case 'ron':
      case 'tokenAmount':
        return formatLargeNumber(new Big(trade?.[key] || 0));
      default:
        return trade[key];
    }
  };

  // watching events
  useEffect(() => {
    const handleTrading = (data: any) => {
      const tokenData = data.token;
      if (pagination.page !== 1) {
        return;
      }
      setListTrades((prevList) => {
        const isBuy = data?.isBuy as boolean;
        let tmpData = {
          userId: data?.senderAddress?.address,
          tokenAmount: isBuy ? data?.amountOut : data?.amountIn,
          ronAmount: !isBuy ? data?.amountOut : data?.amountIn,
          createdAt: data?.timestamp,
          type: isBuy ? 'Buy' : 'Sell',
          lastPrice: data?.lastPrice,
          lastMcap: data?.lastMcap,
          transactionHash: data?.txHash,
          transactionIndex: 0,
          logIndex: 0,
          token: {
            address: tokenData?.address,
            name: tokenData?.name,
            ticker: tokenData?.ticker,
          },
          user: {
            address: data?.senderAddress?.address,
            avatarUrl: data?.senderAddress?.avatarUrl,
            name: data?.senderAddress?.avatarUrl,
          },
          account: data?.senderAddress?.name,
          ron: Number(!isBuy ? data?.amountOut : data?.amountIn).toFixed(2),
          date: getDifferenceTime(data?.timestamp),
          transactionId: data?.txHash?.slice(0, 6),
        };
        setShakeCards((prev) => [data?.txHash?.toLowerCase(), ...prev]);
        setTimeout(() => {
          const temp = shakeCards.filter((card) => card !== data?.txHash);
          setShakeCards(temp);
        }, SHAKE_DURATION);
        return [tmpData, ...prevList].slice(0, 10);
      });
    };

    if (!loading && tokenAddress) {
      // console.log('regis event', `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`);
      socketEmitter.on(
        `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`,
        handleTrading,
      );
    }
    return () => {
      if (socketEmitter) {
        // console.log('off event', `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`);
        socketEmitter.off(
          `${tokenAddress?.toLowerCase()}_${AppSyncEventType.TRADE}`,
          handleTrading,
        );
      }
    };
  }, [loading]);

  return (
    <TableContainer>
      <StyledTradesTable>
        <Thead className="table-header">
          <Tr>
            {tableHeaders.map((header, index) => (
              <Th
                key={index}
                textAlign={header.align as any}
                style={header.style}
                className={header.key}
              >
                {header.key === 'tokenAmount' ? tokenName : header.value}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody className="table-body">
          {!!listTrades.length &&
            listTrades.map((trade, index) => (
              <Tr
                key={`${trade?.transactionHash?.toLowerCase()}_${index}`}
                className={`${
                  shakeCards.includes(trade?.transactionHash?.toLowerCase())
                    ? 'animate-shake'
                    : ''
                }`}
              >
                {tableHeaders.map((col, index) => (
                  <Td textAlign={col.align as any} key={index}>
                    {renderData(col.key, trade)()}
                  </Td>
                ))}
              </Tr>
            ))}
          {!listTrades.length && (
            <Tr>
              <Td
                colSpan={tableHeaders.length}
                textAlign="center"
                height="350px"
              >
                There are no transactions yet
              </Td>
            </Tr>
          )}
        </Tbody>
      </StyledTradesTable>
      {!!pagination?.totalPages && (
        <Pagination
          totalPages={pagination.totalPages}
          currentPage={pagination.page}
          onPageChange={handleChangePage}
        />
      )}
    </TableContainer>
  );
};

export default TradesTable;

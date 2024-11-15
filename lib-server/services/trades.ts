import { DEFAULT_ITEMS_PER_PAGE } from '../../constants';
import { PaginatedResponse, SortDirection } from '../../types';
import { TradesGetData, TradesResponseData } from '../../types/models/Token';
import { filterSearchTerm } from '../../utils';
import { prisma } from '../prisma';

export const getTrades = async (
  tradesGetData: TradesGetData = {},
): Promise<PaginatedResponse<TradesResponseData>> => {
  const {
    page = 1,
    limit = DEFAULT_ITEMS_PER_PAGE,
    searchTerm,
    sortDirection = 'desc',
    sortBy = 'createdAt',
    tokenId,
  } = tradesGetData;

  const search = filterSearchTerm(searchTerm);
  const where = {
    where: {},
  };

  if (search) {
    where.where = {
      ...where.where,
      OR: [
        { type: { contains: search, mode: 'insensitive' } },
        { transactionHash: { contains: search, mode: 'insensitive' } },
      ],
    };
  }
  if (tokenId) {
    where.where = {
      ...where.where,
      tokenId: Number(tokenId),
    };
  }

  const totalCount = await prisma.trade.count(where);

  let trades = await prisma.trade.findMany({
    ...where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortDirection as SortDirection,
    },
  });

  trades = Array.isArray(trades) ? trades : [];
  const result = {
    items: trades.map(
      (trade) =>
        ({
          ...trade,
          id: trade.id.toString(),
          tokenId: trade.tokenId.toString(),
          tokenAmount: trade.tokenAmount.toString(),
          ronAmount: trade.ronAmount.toString(),
        } as TradesResponseData),
    ),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + trades.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  // Math.ceil(1.4) = 2
  // 23 1..10, 11..20, 21..23

  return result;
};
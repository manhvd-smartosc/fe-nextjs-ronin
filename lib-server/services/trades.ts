import { DEFAULT_ITEMS_PER_PAGE } from '../../constants';
import { PaginatedResponse, SortDirection } from '../../types';
import { TradesGetData } from '../../types/models/Token';
import { TradesResponseData } from '../../types/models/Trade';
import { filterSearchTerm } from '../../utils/util';
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
    include: {
      token: {
        select: {
          name: true,
          ticker: true,
          address: true,
        },
      },
      user: {
        select: {
          name: true,
          avatarUrl: true,
          address: true,
        },
      },
    },
  });

  trades = Array.isArray(trades) ? trades : [];
  const result = {
    items: trades.map(
      (trade) =>
        ({
          ...trade,
          token: {
            address: trade.token.address,
            name: trade.token.name,
            ticker: trade.token.ticker,
          },
          user: {
            address: trade.user.address,
            avatarUrl: trade.user.avatarUrl,
            name: trade.user.name,
          },
          id: trade.id.toString(),
          tokenId: trade.tokenId.toString(),
          createdAt: parseInt(trade.createdAt.toString()),
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

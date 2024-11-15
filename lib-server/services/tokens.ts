import { Token } from '@prisma/client';
import { prisma } from '@/lib-server/prisma';
import ApiError from '../errors/apiError';
import {
  TokenCreateData,
  TokensGetData,
  TokensResponseData,
} from '../../types/models/Token';
import { PaginatedResponse, SortDirection } from '../../types';
import { DEFAULT_ITEMS_PER_PAGE } from '../../constants';
import { filterSearchTerm } from '../../utils/util';

// ---------- pages/api/tokens/index.ts
export const createToken = async (
  userId: string,
  tokenCreateData: TokenCreateData,
): Promise<Token> => {
  // check user exists
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) throw new ApiError(`Invalid user id: ${userId} not found.`, 400);

  // check token address exists
  const existingToken = await prisma.token.findUnique({
    where: { address: tokenCreateData.address.toLowerCase() },
  });
  if (existingToken) {
    throw new ApiError('Token address already exists.', 400);
  }

  // create token
  const token = await prisma.token.create({
    data: {
      ...tokenCreateData,
      address: tokenCreateData.address.toLowerCase(),
      createdBy: userId,
    },
  });
  if (!token) throw new ApiError('Token not created.', 400);

  return token;
};

export const getTokens = async (
  tokensGetData: TokensGetData = {},
): Promise<PaginatedResponse<TokensResponseData>> => {
  const {
    page = 1,
    limit = DEFAULT_ITEMS_PER_PAGE,
    searchTerm,
    sortDirection = 'desc',
    sortBy = 'createdAt',
    createdBy,
  } = tokensGetData;

  const search = filterSearchTerm(searchTerm);
  const where = {
    where: {},
  };
  if (createdBy) {
    where.where = {
      ...where.where,
      createdBy: createdBy.toLowerCase(),
    };
  }
  if (search) {
    where.where = {
      ...where.where,
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { ticker: { contains: search, mode: 'insensitive' } },
      ],
    };
  }
  if (sortBy === 'lastFeatured') {
    where.where = {
      ...where.where,
      lastFeatured: {
        gt: 0,
      },
    };
  }

  const totalCount = await prisma.token.count(where);

  let tokens = await prisma.token.findMany({
    ...where,
    include: {
      User: true,
    },
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortDirection as SortDirection,
    },
  });

  tokens = Array.isArray(tokens) ? tokens : [];
  const result = {
    items: tokens.map(
      (token) =>
        ({
          ...token,
          id: token.id.toString(),
          lastBuy: parseInt(token.lastBuy.toString(), 10),
          createdAt: parseInt(token.createdAt.toString(), 10),
          lastComment: parseInt(token.lastComment.toString(), 10),
          totalComments: token.totalComments ?? 0,
          lastFeatured: parseInt(token.lastFeatured.toString(), 10),
        } as TokensResponseData),
    ),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + tokens.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

export const getToken = async (
  address: string,
): Promise<TokensResponseData> => {
  const token = await prisma.token.findFirst({
    where: {
      address: {
        equals: address.toLowerCase(),
        mode: 'insensitive',
      },
    },
  });
  if (!token)
    throw new ApiError(`Token with address: ${address} not found.`, 404);

  return {
    ...token,
    id: token.id.toString(),
    lastBuy: parseInt(token.lastBuy.toString(), 10),
    createdAt: parseInt(token.createdAt.toString(), 10),
    lastComment: parseInt(token.lastComment.toString(), 10),
    totalComments: token.totalComments ?? 0,
    lastFeatured: parseInt(token.lastFeatured.toString(), 10),
  } as TokensResponseData;
};

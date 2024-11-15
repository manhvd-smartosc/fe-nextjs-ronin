import axios from 'axios';
import { PaginatedResponse } from '../../types';
import {
  TokenHolder,
  TokenHoldersGetData,
  TokenHoldersResponseFromIndxer,
} from '@/types/models/TokenHolder';
import { DEFAULT_ITEMS_PER_PAGE } from '@/constants';
import { prisma } from '../prisma';
import { Token, User } from '@prisma/client';

export const getTokenHolders = async (
  queryParams: TokenHoldersGetData,
): Promise<PaginatedResponse<TokenHolder>> => {
  // Implementation here
  // Call api to GraphQL Indexer
  const {
    page = 1,
    limit = DEFAULT_ITEMS_PER_PAGE,
    sortDirection = 'desc',
    sortBy = 'token_id',
    tokenAddress,
    holderAddress,
  } = queryParams;

  const offset = (page - 1) * limit;
  const sortByDirection = `${sortBy.toLocaleUpperCase()}_${sortDirection.toLocaleUpperCase()}`;
  let filter = '';
  if (tokenAddress) {
    filter += `tokenId: { equalToInsensitive: "${tokenAddress}" },`;
  }
  if (holderAddress) {
    filter += `holderAddress: { equalToInsensitive: "${holderAddress}" }`;
  }
  const query = generateQueryTokenHolder(
    offset,
    limit,
    sortByDirection,
    filter,
  );

  try {
    const result = await axios({
      url: process.env.INDEXER_API_URL,
      method: 'post',
      data: {
        operationName: 'MyQuery',
        query: query,
      },
    });

    const tokenHoldersFromIdx = result.data.data
      .tokenHolders as unknown as TokenHoldersResponseFromIndxer;
    let tokenInfoMap = new Map<string, Token>();
    let holderInfoMap = new Map<string, User>();
    if (tokenHoldersFromIdx.nodes.length > 0) {
      // get map token information and holder information by address
      [tokenInfoMap, holderInfoMap] = await Promise.all([
        (async () => {
          const tokens = await prisma.token.findMany({
            where: {
              address: {
                in: tokenHoldersFromIdx.nodes.map((item) => item.tokenId),
                mode: 'insensitive',
              },
            },
          });

          return tokens.reduce((acc, token) => {
            acc.set(token.address.toLocaleLowerCase(), token);
            return acc;
          }, new Map<string, Token>());
        })(),
        (async () => {
          const holders = await prisma.user.findMany({
            where: {
              address: {
                in: tokenHoldersFromIdx.nodes.map((item) => item.holderAddress),
                mode: 'insensitive',
              },
            },
          });
          return holders.reduce((acc, holder) => {
            acc.set(holder.address.toLocaleLowerCase(), holder);
            return acc;
          }, new Map<string, User>());
        })(),
      ]);
    }

    const items = tokenHoldersFromIdx.nodes.map((item) => {
      const token = tokenInfoMap.get(item.tokenId.toLocaleLowerCase());
      const holder = holderInfoMap.get(item.holderAddress.toLocaleLowerCase());
      return {
        holderAddress: {
          name: holder?.name ?? '',
          avatarUrl: holder?.avatarUrl ?? '',
          address: item.holderAddress,
        },
        balance: item.balance,
        token: {
          address: item.tokenId,
          name: token?.name ?? '',
          ticker: token?.ticker ?? '',
          imageUrl: token?.imageUrl ?? '',
          creator: token?.createdBy ?? '',
        },
      } as unknown as TokenHolder;
    });

    return {
      items: items as TokenHolder[],
      pagination: {
        total: tokenHoldersFromIdx.totalCount,
        pagesCount: Math.ceil(tokenHoldersFromIdx.totalCount / limit),
        currentPage: page,
        perPage: limit,
        from: offset,
        to: offset + tokenHoldersFromIdx.nodes.length,
        hasMore: tokenHoldersFromIdx.pageInfo.hasNextPage,
      },
    };
  } catch (error) {}

  return {
    items: [],
    pagination: {
      total: 0,
      pagesCount: 0,
      currentPage: 0,
      perPage: limit,
      from: offset,
      to: offset,
      hasMore: false,
    },
  };
};

const generateQueryTokenHolder = (
  offset: number,
  limit: number,
  sortByDirection: string,
  filter: string,
) => `
        query MyQuery {
          tokenHolders(
            offset: ${offset},
            first: ${limit},
            orderBy: ${sortByDirection},
            ${filter ? `filter: { ${filter} }` : ''}
          ) {
            pageInfo {
              hasPreviousPage
              hasNextPage
            }
            totalCount
            nodes {
              holderAddress
              balance
              tokenId
            }
          }
        }
      `;

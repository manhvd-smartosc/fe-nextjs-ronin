import { Token, Trade, User } from '@prisma/client';
import { SortByTokens, SortDirection } from '..';

export type TokenCreateData = Pick<
  Token,
  | 'name'
  | 'ticker'
  | 'description'
  | 'address'
  | 'createdBy'
  | 'imageUrl'
  | 'telegramUrl'
  | 'twitterUrl'
  | 'websiteUrl'
>;

// --------- Query params request types ----------
// used in queries, api args validation and services

export type TokensGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
  sortBy: SortByTokens;
  createdBy: string;
}>;

export type TradesGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
  sortBy: SortByTokens;
  tokenId: string;
}>;

// --------- Query params response types ----------
export type TokensResponseData = Token & {
  id: string;
  lastComment: number;
  totalComments: number;
  lastBuy: number;
  createdAt: number;
  lastFeatured: number;
  User: User;
};

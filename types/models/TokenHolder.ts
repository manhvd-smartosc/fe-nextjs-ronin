import { SortByTokens, SortDirection } from '..';
import { User } from '@prisma/client';

export type TokenHoldersGetData = Partial<{
  page: number;
  limit: number;
  searchTerm: string;
  sortDirection: SortDirection;
  sortBy: SortByTokens;
  tokenAddress: string;
  holderAddress: string;
}>;

type TokenHoldInfo = {
  address: string;
  imageUrl: string;
  name: string;
  ticker: string;
  creator: string;
};

type HolderInfo = Pick<User, 'address' | 'name' | 'avatarUrl'>;

export type TokenHolder = {
  token: TokenHoldInfo;
  holderAddress: HolderInfo;
  balance: number;
};

export type TokenHoldersResponseFromIndxer = {
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
  totalCount: number;
  nodes: {
    holderAddress: string;
    balance: number;
    tokenId: string;
  }[];
};

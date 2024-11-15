// ------------ Shared types

import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

export type Pagination = {
  total: number;
  pagesCount: number;
  currentPage: number;
  perPage: number;
  from: number;
  to: number;
  hasMore: boolean;
};

/**
 * paginated response for posts and users
 */
export type PaginatedResponse<T> = {
  items: T[];
  pagination: Pagination;
};

export type SortDirection = 'asc' | 'desc';
export type SortByTokens =
  | 'createdAt'
  | 'lastMcap'
  | 'lastComment'
  | 'lastBuy'
  | 'lastFeatured';

// ------------ Next.js types

/**
 * api NextApiRequest req.query
 */
export type QueryParamsType = Partial<{
  [key: string]: string | string[];
}>;

/**
 * getServerSideProps req
 */
export type NextReq = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

/**
 * ErrorBoundary and Loader fallback type
 */
export type FallbackType = 'screen' | 'page' | 'item' | 'test';

/**
 * all props in object non-nullable
 */
export type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

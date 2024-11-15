import { PaginatedResponse } from '../../types';
import { TradesResponseData } from '../../types/models/Trade';

export const tradesMock: PaginatedResponse<TradesResponseData> = {
  items: [],
  pagination: {
    total: 10,
    pagesCount: 2,
    currentPage: 1, // first page
    perPage: 5,
    from: 1,
    to: 5,
    hasMore: true,
  },
};

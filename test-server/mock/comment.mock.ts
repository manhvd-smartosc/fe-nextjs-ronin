import { PaginatedResponse } from '../../types';
import { CommentResponseData } from '../../types/models/Comment';
import { TradesResponseData } from '../../types/models/Trade';

export const commentsMock: PaginatedResponse<CommentResponseData> = {
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

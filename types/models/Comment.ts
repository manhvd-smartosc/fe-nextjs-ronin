import { Comment } from '@prisma/client';
import { SortByTokens, SortDirection } from '..';

// --------- Query params request types ----------
// used in queries, api args validation and services

export type CommentsGetData = Partial<{
  page: number;
  limit: number;
  sortDirection: SortDirection;
  sortBy: SortByTokens;
  createdBy: string;
  tokenId: string;
}>;

export type CommentPostData = Pick<
  Comment,
  'text' | 'imageUrl' | 'tokenId' | 'userId'
>;

// --------- Query params response types ----------
export type CommentResponseData = Comment & {
  id: string;
  tokenId: string;
};

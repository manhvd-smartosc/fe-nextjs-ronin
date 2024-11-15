import { prisma } from '@/lib-server/prisma';
import {
  CommentPostData,
  CommentResponseData,
  CommentsGetData,
} from '../../types/models/Comment';
import { PaginatedResponse, SortDirection } from '../../types';
import { DEFAULT_ITEMS_PER_PAGE } from '../../constants';
import { Comment } from '@prisma/client';
import ApiError from '../error';

export const getComments = async (
  commentsGetData: CommentsGetData = {},
): Promise<PaginatedResponse<CommentResponseData>> => {
  const {
    page = 1,
    limit = DEFAULT_ITEMS_PER_PAGE,
    sortDirection = 'desc',
    sortBy = 'createdAt',
    createdBy,
    tokenId,
  } = commentsGetData;

  const where = {
    where: {
      ...(createdBy && {
        userId: createdBy.toLowerCase(),
      }),
      ...(tokenId && {
        tokenId: Number(tokenId),
      }),
    },
  };

  const totalCount = await prisma.comment.count({ ...where });

  let comments = await prisma.comment.findMany({
    ...where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      [sortBy]: sortDirection as SortDirection,
    },
    include: {
      user: true,
    },
  });

  comments = Array.isArray(comments) ? comments : [];
  const result = {
    items: comments.map(
      (comment: any) =>
        ({
          ...comment,
          id: comment.id.toString(),
          tokenId: comment.tokenId.toString(),
        } as CommentResponseData),
    ),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + comments.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  // Math.ceil(1.4) = 2
  // 23 1..10, 11..20, 21..23

  return result;
};

export const postCommentToToken = async (
  commentPost: CommentPostData,
): Promise<CommentResponseData> => {
  const token = await prisma.token.findUnique({
    where: { id: commentPost.tokenId },
  });
  console.log('token', token);

  if (!token) {
    throw new ApiError('Token not found', 404);
  }

  const comment = await prisma.comment.create({
    data: commentPost,
  });

  return {
    ...comment,
    id: comment.id.toString(),
    tokenId: comment.tokenId.toString(),
  } as CommentResponseData;
};
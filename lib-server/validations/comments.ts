import { z } from 'zod';
import { stringToNumber } from './validationUtils';
import { withValidation } from 'next-validations';
import { QueryParamsType } from '../../types';
import { CommentsGetData } from '../../types/models/Comment';
import ApiError from '../errors/apiError';

const commentsLimitMax = 100;
// ================ Validation Comments Schemas ================
const commentsGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(
    stringToNumber,
    z.number().min(1).max(commentsLimitMax).optional(),
  ),
  tokenId: z.string().optional(),
  createdBy: z.string().optional(),
  imageUrl: z.string().optional(),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('asc'))
    .or(z.literal('desc')),
  sortBy: z.string().optional().or(z.literal('')).or(z.literal('created_at')),
});

export const validateCommentsGet = withValidation({
  schema: commentsGetSchema,
  type: 'Zod',
  mode: 'query',
});
export const validateCommentsQueryParams = (
  params: QueryParamsType,
): CommentsGetData => {
  const result = commentsGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as CommentsGetData;
};

const commentPostSchema = z.object({
  text: z.string().min(1).max(255),
  tokenId: z
    .string()
    .refine((val) => val.length > 0)
    .transform((v) => parseInt(v, 10)),
});
export const validateCommentPost = withValidation({
  schema: commentPostSchema,
  type: 'Zod',
  mode: 'body',
});

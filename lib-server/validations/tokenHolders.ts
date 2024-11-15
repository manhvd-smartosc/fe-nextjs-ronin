import { withValidation } from 'next-validations';
import { z } from 'zod';
import { QueryParamsType } from '../../types';
import ApiError from '../errors/apiError';
import { stringToNumber } from './validationUtils';
import { TokenHoldersGetData } from '../../types/models/TokenHolder';

const tokenHolderLimitMax = 20;
const tokenHoldersGetSchema = z.object({
  tokenAddress: z.string().optional(),
  holderAddress: z.string().optional(),
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(
    stringToNumber,
    z.number().min(1).max(tokenHolderLimitMax).optional(),
  ),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('asc'))
    .or(z.literal('desc')),
  sortBy: z.string().optional().or(z.literal('')).or(z.literal('created_at')),
});

export const validateTokenHoldersGet = withValidation({
  schema: tokenHoldersGetSchema,
  type: 'Zod',
  mode: 'query',
});

export const validateTokenHoldersQueryParams = (
  params: QueryParamsType,
): TokenHoldersGetData => {
  const result = tokenHoldersGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as TokenHoldersGetData;
};

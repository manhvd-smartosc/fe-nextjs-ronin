import { z } from 'zod';
import { stringToNumber } from './validationUtils';
import { withValidation } from 'next-validations';
import { QueryParamsType } from '../../types';
import { TradesGetData } from '../../types/models/Token';
import ApiError from '../errors/apiError';

const tradesLimitMax = 100;
// ================ Validation Trades Schemas ================
const tradesGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(
    stringToNumber,
    z.number().min(1).max(tradesLimitMax).optional(),
  ),
  searchTerm: z.string().optional().or(z.literal('')),
  sortDirection: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('asc'))
    .or(z.literal('desc')),
  sortBy: z
    .string()
    .optional()
    .or(z.literal(''))
    .or(z.literal('created_at'))
    .or(z.literal('last_mcap'))
    .or(z.literal('last_comment')),
  tokenId: z.string().optional(),
});
export const validateTradesGet = withValidation({
  schema: tradesGetSchema,
  type: 'Zod',
  mode: 'query',
});
export const validateTradesQueryParams = (
  params: QueryParamsType,
): TradesGetData => {
  const result = tradesGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data as TradesGetData;
};

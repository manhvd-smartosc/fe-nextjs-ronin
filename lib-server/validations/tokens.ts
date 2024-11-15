import { z } from 'zod';
import { stringToNumber } from './validationUtils';
import { QueryParamsType, SortByTokens } from '../../types';
import { TokensGetData } from '../../types/models/Token';
import ApiError from '../errors/apiError';
import { withValidation } from 'next-validations';

const tokensLimitMax = 100;
// ================ Validation Token Schemas ================
const tokensGetSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(
    stringToNumber,
    z.number().min(1).max(tokensLimitMax).optional(),
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
    .or(z.literal('createdAt'))
    .or(z.literal('lastMcap'))
    .or(z.literal('lastComment'))
    .or(z.literal('lastFeatured')),
  createdBy: z.string().optional(),
});

const tokenPostSchema = z.object({
  name: z.string(),
  ticker: z.string(),
  description: z.string().optional(),
  address: z
    .string()
    .refine((val) => val.length > 0)
    .transform((val) => val.toLowerCase()),
  createdBy: z.string().refine((val) => val.length > 0),
  lastBuy: z.date().optional(),
  lastComment: z.date().optional(),
  lastPrice: z.number().optional(),
  poolId: z.string().optional(),
  lastMcap: z.number().optional(),
  imageUrl: z.string().min(1).max(255),
  telegramUrl: z.string().min(1).max(255).optional(),
  twitterUrl: z.string().min(1).max(255).optional(),
  websiteUrl: z.string().min(1).max(255).optional(),
});

export const validateTokensSearchQueryParams = (
  params: QueryParamsType,
): TokensGetData => {
  const result = tokensGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);
  // check if sortBy is value, it should be one of the values
  const sortByValues = [
    'createdAt',
    'lastMcap',
    'lastComment',
    'lastBuy',
    'lastFeatured',
  ];
  if (
    result.data.sortBy &&
    !sortByValues.includes(result.data.sortBy as string)
  ) {
    // sortby only must be one of the values in the array
    throw new ApiError(
      `Invalid sortBy value. Sortby must be one of the values in the array [${sortByValues.join(
        ', ',
      )}]`,
      400,
    );
  }

  return result.data as TokensGetData;
};

export const validateTokensGet = withValidation({
  schema: tokensGetSchema,
  type: 'Zod',
  mode: 'query',
});

export const validateTokenPost = withValidation({
  schema: tokenPostSchema,
  type: 'Zod',
  mode: 'body',
});

const tokenIdSchema = z.object({
  id: z.string().refine((val) => val.length > 0),
});
export const validateTokenIdGet = withValidation({
  schema: tokenIdSchema,
  type: 'Zod',
  mode: 'query',
});
export const validateTokenIdPathParams = (id: string): string => {
  const result = tokenIdSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError(result.error);

  return result.data.id;
};

const tokensCreatedSchema = z.object({
  page: z.preprocess(stringToNumber, z.number().min(1).optional()),
  limit: z.preprocess(
    stringToNumber,
    z.number().min(1).max(tokensLimitMax).optional(),
  ),
  id: z.string().refine((val) => val.length > 0),
});

export const validateTokensCreated = withValidation({
  schema: tokensCreatedSchema,
  type: 'Zod',
  mode: 'query',
});

export const validateTokensCreatedQueryParams = (
  params: QueryParamsType,
): TokensGetData => {
  const result = tokensCreatedSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  return { ...result.data, createdBy: result.data.id } as TokensGetData;
};

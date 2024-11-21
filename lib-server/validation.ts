import { withValidation } from 'next-validations';
import { z } from 'zod';
import { QueryParamsType } from '../types';
import { TokensGetData } from '../types/models/Token';
import ApiError from './error';

const tokensLimitMax = 100;
// query params numbers are strings, parse them before validating
// only req.query are strings, req.body preservs correct types
const stringToNumber = (numberArg: unknown): unknown => {
  // convert (arg: string): number | undefined to (arg: unknown): unknown
  // for typescript strict
  const numberStr = numberArg as string;
  const result = numberStr
    ? parseInt(z.string().parse(numberStr), 10)
    : undefined;
  return result as unknown;
};

const stringToBoolean = (booleanArg: unknown): unknown => {
  // convert (arg: string): boolean | undefined to (arg: unknown): unknown
  const booleanStr = booleanArg as string;
  const result = booleanStr
    ? z.string().parse(booleanStr) === 'true'
    : undefined;
  return result as unknown;
};

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
    .or(z.literal('created_at'))
    .or(z.literal('last_mcap'))
    .or(z.literal('last_comment')),
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

// ----------- convert types with safeParse() -------------

export const validateTokensSearchQueryParams = (
  params: QueryParamsType,
): TokensGetData => {
  const result = tokensGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

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

// ================ Validation Profile Schemas ================
const userIdSchema = z.object({
  id: z.string().refine((val) => val.length > 0),
});

export const validateUserId = withValidation({
  schema: userIdSchema,
  type: 'Zod',
  mode: 'query',
});

export const validateUserIdPathParams = (id: string): string => {
  const result = userIdSchema.safeParse({ id });
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
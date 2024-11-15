import { withValidation } from 'next-validations';
import { z } from 'zod';
import { QueryParamsType } from '../../types';
import { CandlesTickInputData } from '../../types/models/CandlesTicks';
import ApiError from '../errors/apiError';

// ================ Validation Candles Ticks Schemas ================
const candlesTicksGetSchema = z.object({
  tokenAddress: z.string().refine((val) => val.length > 0),
  startTime: z
    .string()
    .optional()
    .transform((v) => parseInt(v ?? '0', 10)),
  endTime: z
    .string()
    .optional()
    .transform((v) => parseInt(v ?? '0', 10)),
  timeframe: z.string().or(z.literal('1min')).or(z.literal('5min')),
});

export const validateCandlesTicksGet = withValidation({
  schema: candlesTicksGetSchema,
  type: 'Zod',
  mode: 'query',
});

export const validateCandlesTicksQueryParams = (
  params: QueryParamsType,
): CandlesTickInputData => {
  const result = candlesTicksGetSchema.safeParse(params);
  if (!result.success) throw ApiError.fromZodError(result.error);

  const data = result.data as CandlesTickInputData;
  if (data.endTime && data.startTime && data.endTime < data.startTime) {
    throw new ApiError('End time must be greater than start time', 400);
  }

  return data;
};

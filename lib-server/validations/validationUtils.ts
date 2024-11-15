import { withValidation } from 'next-validations';
import { z } from 'zod';
import { QueryParamsType } from '../../types';
import { TokensGetData, TradesGetData } from '../../types/models/Token';
import ApiError from '../errors/apiError';
import { CommentsGetData } from '../../types/models/Comment';
import { CandlesTickInputData } from '../../types/models/CandlesTicks';

// query params numbers are strings, parse them before validating
// only req.query are strings, req.body preservs correct types
export const stringToNumber = (numberArg: unknown): unknown => {
  // convert (arg: string): number | undefined to (arg: unknown): unknown
  // for typescript strict
  const numberStr = numberArg as string;
  const result = numberStr
    ? parseInt(z.string().parse(numberStr), 10)
    : undefined;
  return result as unknown;
};

export const stringToBoolean = (booleanArg: unknown): unknown => {
  // convert (arg: string): boolean | undefined to (arg: unknown): unknown
  const booleanStr = booleanArg as string;
  const result = booleanStr
    ? z.string().parse(booleanStr) === 'true'
    : undefined;
  return result as unknown;
};

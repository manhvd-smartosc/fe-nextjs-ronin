import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '@/lib-server/next-connect';
import { PaginatedResponse } from '@/types';
import { TradesResponseData } from '@/types/models/Token';
import { getTrades } from '@/lib-server/services/trades';
import {
  validateTradesGet,
  validateTradesQueryParams,
} from '@/lib-server/validation';

const handler = apiHandler();

// GET: /api/trades
handler.get(
  validateTradesGet(),
  async (
    req: NextApiRequest,
    res: NextApiResponse<PaginatedResponse<TradesResponseData>>,
  ) => {
    // just to convert types
    const parsedData = validateTradesQueryParams(req.query);

    const tokens = await getTrades(parsedData);
    return res.status(200).json(tokens);
  },
);

export default handler;

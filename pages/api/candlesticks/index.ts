import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '@/lib-server/next-connect';
import { getCandlesticks } from '@/lib-server/services/candlesticks';
import {
  validateCandlesTicksGet,
  validateCandlesTicksQueryParams,
} from '@/lib-server/validations/candlesticks';

const handler = apiHandler();

// GET: /api/candlesticks
handler.get(
  validateCandlesTicksGet(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    // just to convert types
    const parsedData = validateCandlesTicksQueryParams(req.query);
    const tokens = await getCandlesticks(parsedData);
    return res.status(200).json(tokens);
  },
);

export default handler;

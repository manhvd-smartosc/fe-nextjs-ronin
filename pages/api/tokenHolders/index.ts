import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '@/lib-server/next-connect';
import {
  validateTokenHoldersGet,
  validateTokenHoldersQueryParams,
} from '@/lib-server/validations/tokenHolders';
import { getTokenHolders } from '@/lib-server/services/tokenHolders';
import { PaginatedResponse } from '../../../types';
import { TokenHolder } from '../../../types/models/TokenHolder';

const handler = apiHandler();

// GET: /api/tokenHolders
handler.get(
  validateTokenHoldersGet(),
  async (
    req: NextApiRequest,
    res: NextApiResponse<PaginatedResponse<TokenHolder>>,
  ) => {
    // just to convert types
    const parsedData = validateTokenHoldersQueryParams(req.query);
    const tokens = await getTokenHolders(parsedData);
    return res.status(200).json(tokens);
  },
);

export default handler;

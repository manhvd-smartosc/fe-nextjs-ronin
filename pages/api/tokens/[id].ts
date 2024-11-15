import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '@/lib-server/next-connect';

import { getToken } from '@/lib-server/services/tokens';
import { TokensResponseData } from '@/types/models/Token';
import {
  validateTokenIdGet,
  validateTokenIdPathParams,
} from '@/lib-server/validations/tokens';

const handler = apiHandler();

// GET: /api/tokens/:id
handler.get(
  validateTokenIdGet(),
  async (req: NextApiRequest, res: NextApiResponse<TokensResponseData>) => {
    // just to convert types
    const parsedData = validateTokenIdPathParams(req.query.id as string);

    const token = await getToken(parsedData);
    return res.status(200).json(token);
  },
);

export default handler;

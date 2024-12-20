import { apiHandler } from '@/lib-server/next-connect';
import { NextApiRequest, NextApiResponse } from 'next';

import { getTokens } from '@/lib-server/services/tokens';
import {
  validateTokensCreated,
  validateTokensCreatedQueryParams,
} from '@/lib-server/validations/tokens';

const handler = apiHandler();

// GET: /api/profile/:userId/tokensCreated
handler.get(
  validateTokensCreated(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const parsedData = validateTokensCreatedQueryParams(req.query);

    const tokens = await getTokens(parsedData);
    return res.status(200).json(tokens);
  },
);

export default handler;

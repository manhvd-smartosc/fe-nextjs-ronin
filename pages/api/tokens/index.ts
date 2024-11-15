import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '@/lib-server/next-connect';
import {
  validateTokenPost,
  validateTokensGet,
  validateTokensSearchQueryParams,
} from '@/lib-server/validation';
import { createToken, getTokens } from '@/lib-server/services/tokens';
import { PaginatedResponse } from '@/types';
import { TokensResponseData } from '@/types/models/Token';
import { requireAuth } from '@/lib-server/middleware/auth';

const handler = apiHandler();

// GET: /api/tokens
handler.get(
  validateTokensGet(),
  async (
    req: NextApiRequest,
    res: NextApiResponse<PaginatedResponse<TokensResponseData>>,
  ) => {
    // just to convert types
    const parsedData = validateTokensSearchQueryParams(req.query);

    const tokens = await getTokens(parsedData);
    return res.status(200).json(tokens);
  },
);

// POST: /api/tokens
handler.post(
  requireAuth,
  validateTokenPost(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await createToken(
      '0x9211f7b1d83f7db6a39d5eaebfa40d245019f269',
      req.body,
    );

    return res.status(200).json({ ...token, id: token.id.toString() });
  },
);

export default handler;

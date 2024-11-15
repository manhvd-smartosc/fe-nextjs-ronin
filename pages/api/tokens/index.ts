import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '@/lib-server/next-connect';
import { createToken, getTokens } from '@/lib-server/services/tokens';
import { PaginatedResponse } from '@/types';
import { TokensResponseData } from '@/types/models/Token';
import { requireAuth } from '@/lib-server/middleware/auth';
import { getMe } from '@/lib-server/services/users';
import ApiError from '@/lib-server/errors/apiError';
import {
  validateTokenPost,
  validateTokensGet,
  validateTokensSearchQueryParams,
} from '@/lib-server/validations/tokens';

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
    const me = await getMe({ req });
    if (!me) {
      new ApiError('You are not logged in.', 401);
    }
    const token = await createToken(me?.id ?? '', req.body);

    return res.status(200).json({ ...token, id: token.id.toString() });
  },
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

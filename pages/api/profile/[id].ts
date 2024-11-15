import { apiHandler } from '@/lib-server/next-connect';

import { getUser } from '@/lib-server/services/users';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  validateUserId,
  validateUserIdPathParams,
} from '@/lib-server/validations/profile';

const handler = apiHandler();

// GET /api/profile/:id
handler.get(
  validateUserId(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = validateUserIdPathParams(req.query.id as string);
    const user = await getUser(userId);
    res.status(200).json(user);
  },
);

export default handler;

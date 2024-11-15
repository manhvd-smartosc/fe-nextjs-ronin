import { apiHandler } from '@/lib-server/next-connect';
import {
  validateUserId,
  validateUserIdPathParams,
} from '@/lib-server/validation';
import { getUser } from '@/lib-server/services/users';
import { NextApiRequest, NextApiResponse } from 'next';
import { requireAuth } from '../../../lib-server/middleware/auth';

const handler = apiHandler();

// GET /api/profile/:id
handler.get(validateUserId(), async (req, res) => {
  const userId = validateUserIdPathParams(req.query.id as string);
  const user = await getUser(userId);
  res.status(200).json(user);
});

export default handler;

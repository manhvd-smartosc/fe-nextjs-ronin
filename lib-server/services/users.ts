import { User } from '@prisma/client';
import { GetSessionParams } from 'next-auth/react';
import { prisma } from '@/lib-server/prisma';
import ApiError from '../error';
import { getToken } from 'next-auth/jwt';
import { NextApiRequest } from 'next';

/**
 *
 * @returns null on fail, doesn't throw exception, user is not logged in
 *
 */
export const getMe = async (params: GetSessionParams): Promise<User | null> => {
  const token = await getToken({
    req: params.req as NextApiRequest,
    secret: process.env.NEXT_AUTH_SECRET,
  });
  const id = token?.id;
  if (!id) return null;

  const me = await prisma.user.findUnique({ where: { id: id.toString() } });

  if (!me) return null;

  return me;
};

// -------- pages/api/users/[id].ts
export const getUser = async (id: string): Promise<User> => {
  const user = await prisma.user.findUnique({
    where: { id: id.toLowerCase() },
  });
  if (!user) throw new ApiError(`User with id: ${id} not found.`, 404);

  return user;
};

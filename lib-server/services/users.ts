import { User } from '@prisma/client';
import { GetSessionParams } from 'next-auth/react';
import { prisma } from '@/lib-server/prisma';
import ApiError from '../errors/apiError';
import { getToken } from 'next-auth/jwt';
import { NextApiRequest } from 'next';
import { ProfileUpdateServiceData } from '../../types/models/User';

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

export const updateProfile = async (
  data: ProfileUpdateServiceData,
  currentUser: User,
): Promise<User> => {
  let lastUpdatedName = currentUser.lastUpdatedName;
  if (data.name && data.name !== currentUser.name) {
    lastUpdatedName = new Date();
  }

  const user = await prisma.user.update({
    where: { id: currentUser.id.toLowerCase() },
    data: {
      ...data,
      lastUpdatedName,
    },
  });

  return user;
};

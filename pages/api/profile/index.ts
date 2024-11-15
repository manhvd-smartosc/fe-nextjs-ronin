import { apiHandler } from '@/lib-server/next-connect';
import { requireAuth } from '@/lib-server/middleware/auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMe, updateProfile } from '@/lib-server/services/users';
import ApiError from '@/lib-server/errors/apiError';
import {
  MulterRequest,
  imagesUploadMiddleware,
} from '@/lib-server/middleware/upload';
import { removeFromS3, uploadToS3 } from '@/lib-server/services/upload';
import { ProfileUpdateServiceData } from '@/types/models/User';
import { validateProfileUpdate } from '@/lib-server/validations/profile';
import { A_DAY_IN_MILLISECONDS } from '@/lib-server/constants/constants';
import { prisma } from '@/lib-server/prisma';

const handler = apiHandler();

handler.put(
  requireAuth,
  imagesUploadMiddleware,
  validateProfileUpdate(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const me = await getMe({ req });
    if (!me) {
      throw new ApiError('You are not logged in.', 401);
    }

    // check user only can change your name once every day
    if (me.name !== req.body.name) {
      const lastUpdatedName = new Date(me.lastUpdatedName ?? 0);
      const now = new Date();
      const diff = now.getTime() - lastUpdatedName.getTime();
      const diffDays = diff / A_DAY_IN_MILLISECONDS;
      if (diffDays < 1) {
        throw new ApiError('You can change your username once every day.', 400);
      }

      // valid username
      const nameExisted = await prisma.user.findFirst({
        where: { name: req.body.name },
      });
      if (nameExisted && nameExisted.id !== me.id) {
        throw new ApiError(`Username already taken.`, 400);
      }
    }

    const { file: avatarFile } = req as MulterRequest;
    const { name = me.name, bio = me.bio } = req.body;
    const updateProfileData: ProfileUpdateServiceData = {
      name,
      bio,
      avatarUrl: me.avatarUrl,
    };
    if (avatarFile) {
      // upload avatar to S3
      const avatarUrl = await uploadToS3(avatarFile as Express.Multer.File);
      updateProfileData.avatarUrl = avatarUrl;

      // remove old avatar
      if (me.avatarUrl) {
        // remove old avatar
        await removeFromS3(me.avatarUrl);
      }
    }

    const newProfile = await updateProfile(updateProfileData, me);
    // update user
    return res.status(200).json({ ...newProfile });
  },
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

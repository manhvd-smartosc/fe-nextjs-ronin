import { apiHandler } from '@/lib-server/next-connect';
import { requireAuth } from '@/lib-server/middleware/auth';
import { validateProfileUpdate } from '@/lib-server/validation';
import { NextApiRequest, NextApiResponse } from 'next';
import { getMe, updateProfile } from '@/lib-server/services/users';
import ApiError from '@/lib-server/error';
import {
  MulterRequest,
  imagesUploadMiddleware,
} from '@/lib-server/middleware/upload';
import { uploadToS3 } from '@/lib-server/services/upload';
import { ProfileUpdateServiceData } from '../../../types/models/User';

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
    }

    const newProfile = await updateProfile(me.id, updateProfileData);
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

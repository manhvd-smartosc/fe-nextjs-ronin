import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from '@/lib-server/next-connect';
import {
  validateCommentPost,
  validateCommentsGet,
  validateCommentsQueryParams,
  validateTokensSearchQueryParams,
} from '@/lib-server/validation';
import { PaginatedResponse } from '@/types';
import { CommentPostData, CommentsGetData } from '@/types/models/Comment';
import {
  getComments,
  postCommentToToken,
} from '@/lib-server/services/comments';
import { requireAuth } from '@/lib-server/middleware/auth';
import {
  MulterRequest,
  imagesUploadMiddleware,
} from '@/lib-server/middleware/upload';
import { getMe } from '@/lib-server/services/users';
import ApiError from '@/lib-server/error';
import { uploadToS3 } from '../../../lib-server/services/upload';

const handler = apiHandler();

// GET: /api/comments
handler.get(
  validateCommentsGet(),
  async (
    req: NextApiRequest,
    res: NextApiResponse<PaginatedResponse<CommentsGetData>>,
  ) => {
    // just to convert types
    const parsedData = validateCommentsQueryParams(req.query);
    const comments = await getComments(parsedData);
    return res.status(200).json(comments);
  },
);

// POST: /api/comments
handler.post(
  requireAuth,
  imagesUploadMiddleware,
  validateCommentPost(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const me = await getMe({ req });
    if (!me) {
      throw new ApiError('You are not logged in.', 401);
    }

    const { file: imageFile } = req as MulterRequest;
    const { text, tokenId } = req.body;
    const commentData: CommentPostData = {
      text,
      tokenId,
      userId: me.id,
      imageUrl: '',
    };
    if (imageFile) {
      // upload avatar to S3
      const imageUrl = await uploadToS3(imageFile as Express.Multer.File);
      commentData.imageUrl = imageUrl;
    }
    const comment = await postCommentToToken(commentData);

    return res.status(200).json(comment);
  },
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

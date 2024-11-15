import { requireAuth } from '@/lib-server/middleware/auth';
import { imagesUploadMiddleware } from '@/lib-server/middleware/upload';
import { apiHandler } from '@/lib-server/next-connect';
import { uploadToIPFS } from '@/lib-server/services/upload';
import { NextApiRequest, NextApiResponse } from 'next';
const handler = apiHandler();
type MulterRequest = NextApiRequest & { file: any };

handler.post(
  // requireAuth,
  imagesUploadMiddleware,
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { file } = req as MulterRequest;
    console.log('file', file);

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = await uploadToIPFS(file as unknown as File);
    return res.status(200).json({ imageUrl });
  },
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;

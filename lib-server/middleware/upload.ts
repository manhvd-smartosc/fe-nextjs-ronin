import multer from 'multer';
import { NextApiRequest } from 'next';
import { extname } from 'path';

export type MulterRequest = NextApiRequest & { file: any };

export const imagesUploadMiddleware = multer({
  // storage: multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, 'public/uploads/');
  //   },
  //   filename: async (req, file, cb) => {
  //     const fileName = `${moment().format(momentFormats.dateTimeForFiles)}__${
  //       file.originalname
  //     }`;
  //     cb(null, fileName);
  //   },
  // }),
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    const { originalname, mimetype, fieldname, size } = file;

    const extension = extname(originalname);
    if (
      !['.png', '.jpg', '.jpeg'].includes(extension) ||
      !['image/png', 'image/jpg', 'image/jpeg'].includes(mimetype)
    ) {
      return cb(new Error('Only images are allowed'));
    }

    if (size > 2 * 1024 * 1024) {
      return cb(new Error('Avatar image size exceeds 1 MB'));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 2,
    files: 1,
  },
}).single('file');

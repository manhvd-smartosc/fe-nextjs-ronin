import axios from 'axios';
import ApiError from '../errors/apiError';
import FormData from 'form-data';
import { DeleteObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../utils/s3';
import { uniqueString } from '../../utils';
import { extname } from 'path';

export const uploadToIPFS = async (
  file: Express.Multer.File,
): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: `tama_${uniqueString(50)}${extname(file.originalname)}`,
      contentType: file.mimetype,
    });

    const response = await axios.post(
      `${process.env.PINATA_API_URL}`,
      formData,
      {
        maxContentLength: Infinity,
        headers: {
          Accept: '*/*',
          'Content-Type': `multipart/form-data;`,
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
          pinata_api_key: `${process.env.PINATA_API_KEY}`,
          pinata_secret_api_key: `${process.env.PINATA_SECRET_API_KEY}`,
        },
      },
    );
    const data = await response.data;
    return `${process.env.PINATA_GATEWAY_URL}/${data.IpfsHash}`;
  } catch (error) {
    throw new ApiError('Error uploading to IPFS', 500);
  }
};

export const uploadToS3 = async (
  file: Express.Multer.File,
  prefix = 'avatar',
): Promise<string> => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const filename = `images/avatar_${uniqueString(50)}${extname(
      file.originalname,
    )}`;

    const params = {
      Bucket: bucketName,
      Key: filename, // File name in the S3 bucket
      Body: file.buffer, // File content
      ContentType: file.mimetype, // MIME type of the file
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    console.log('File uploaded successfully!');
    return `${process.env.AWS_BUCKET_URL}/${filename}`;
  } catch (error) {
    console.error('Error uploading to S3', error);

    throw new ApiError('Error uploading to S3', 500);
  }
};

export const removeFromS3 = async (url: string): Promise<void> => {
  try {
    const bucketName = process.env.AWS_BUCKET_NAME;
    const filename = url.replace(`${process.env.AWS_BUCKET_URL}/`, '');

    const params = {
      Bucket: bucketName,
      Key: filename,
    };

    await s3Client.send(new DeleteObjectCommand(params));

    console.log('File removed successfully!');
  } catch (error) {
    console.error('Error removing file', error);
    throw new ApiError('Error removing file', 500);
  }
};

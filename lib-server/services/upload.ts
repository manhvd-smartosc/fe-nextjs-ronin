import { API_URL } from '@/constants';
import axios from 'axios';
import buffer from 'buffer';
// import FormData from 'form-data';

export const uploadToIPFS = async (file: File): Promise<string> => {
  try {
    const blob = new Blob([file.buffer], { type: file.type });
    const fileUpload = new buffer.File([blob], file.name);
    // console.log({ fileTest, file });

    const formData = new FormData();
    formData.append('file', fileUpload);

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
    console.log({
      data,
    });
  } catch (error) {
    console.error(error);
  }

  return '';
};

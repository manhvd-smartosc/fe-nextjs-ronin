import axios from 'axios';
import { toast } from 'react-toastify';

const uploadFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post('/api/uploads/ipfs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    toast.error('Error uploading file');
  }
};

export default uploadFile;

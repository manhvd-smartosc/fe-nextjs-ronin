import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

type FetchProfileDetailParams = {
  address: string;
};

type UpdateProfileParams = {
  name: string;
  bio: string;
  file: File;
};

async function fetchProfileDetail({ address }: FetchProfileDetailParams) {
  try {
    const response = await fetch(`${API_URL.PROFILE}/${address}`);
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Fetch profile failed');
  }
}

async function updateProfile({ name, bio, file }: UpdateProfileParams) {
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    formData.append('file', file);

    const response = await fetch(`${API_URL.PROFILE}`, {
      method: 'PUT',
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Update profile failed');
  }
}

export { fetchProfileDetail, updateProfile };

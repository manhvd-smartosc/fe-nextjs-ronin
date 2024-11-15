import { toast } from 'react-toastify';
import { API_URL } from '@/constants';

type FetchListCommentParams = {
  createdBy?: string;
  tokenId?: string;
  page?: number;
  limit?: number;
};

type PostCommentParams = {
  tokenId: string;
  content: string;
  file?: File | null;
};

async function fetchListComment({
  createdBy,
  tokenId,
  page,
  limit,
}: FetchListCommentParams) {
  try {
    const queryParams = new URLSearchParams();
    if (createdBy) queryParams.append('createdBy', createdBy);
    if (tokenId) queryParams.append('tokenId', tokenId);
    if (page !== undefined) queryParams.append('page', page.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    const response = await fetch(
      `${API_URL.COMMENT}?${queryParams.toString()}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Fetch list comment failed');
  }
}

async function postComment({ tokenId, content, file }: PostCommentParams) {
  try {
    const formData = new FormData();
    formData.append('tokenId', tokenId);
    formData.append('text', content);
    if (file) {
      formData.append('file', file);
    }
    const response = await fetch(`${API_URL.COMMENT}`, {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Update profile failed');
  }
}

export { fetchListComment, postComment };

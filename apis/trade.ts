import { toast } from 'react-toastify';
import { API_URL } from '@/constants';

type FetchListCommentParams = {
  createdBy?: string;
  tokenId?: string;
  page?: number;
  limit?: number;
};

async function fetchListTrade({
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
      `${API_URL.TRADE}?${queryParams.toString()}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Fetch list comment failed');
  }
}

export { fetchListTrade };

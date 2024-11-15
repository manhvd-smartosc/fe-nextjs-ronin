import { toast } from 'react-toastify';
import { API_URL } from '@/constants';

type FetchListTokenHoldersParams = {
  holderAddress?: string;
  tokenAddress?: string;
  sortDirection?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
};

async function fetchListTokenHolders({
  holderAddress,
  tokenAddress,
  sortDirection,
  sortBy,
  page,
  limit,
}: FetchListTokenHoldersParams) {
  try {
    const queryParams = new URLSearchParams();
    if (holderAddress) queryParams.append('holderAddress', holderAddress);
    if (tokenAddress) queryParams.append('tokenAddress', tokenAddress);
    if (page !== undefined) queryParams.append('page', page.toString());
    if (limit !== undefined) queryParams.append('limit', limit.toString());
    if (sortDirection) queryParams.append('sortDirection', sortDirection);
    if (sortBy) queryParams.append('sortBy', sortBy);
    const response = await fetch(
      `${API_URL.TOKEN_HOLDERS}?${queryParams.toString()}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Fetch list holders failed');
  }
}

export { fetchListTokenHolders };

import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

type FetchTokenListParams = {
  searchTerm?: string;
  sortDirection?: string;
  sortBy?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
};

async function fetchTokenList({
  searchTerm,
  sortDirection,
  sortBy,
  createdBy,
  page,
  limit,
}: FetchTokenListParams) {
  const queryParams = new URLSearchParams();
  if (searchTerm) queryParams.append('searchTerm', searchTerm);
  if (sortDirection) queryParams.append('sortDirection', sortDirection);
  if (sortBy) queryParams.append('sortBy', sortBy);
  if (createdBy) queryParams.append('createdBy', createdBy);
  if (page !== undefined) queryParams.append('page', page.toString());
  if (limit !== undefined) queryParams.append('limit', limit.toString());
  try {
    const response = await fetch(`${API_URL.TOKEN}?${queryParams.toString()}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Get list token failed');
  }
}

const getTokenDetail = async (tokenAddress: string) => {
  try {
    const response = await fetch(`${API_URL.TOKEN}/${tokenAddress}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Get token detail failed');
  }
};

export { fetchTokenList, getTokenDetail };

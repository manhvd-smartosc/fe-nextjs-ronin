import { toast } from 'react-toastify';
import { API_URL } from '../constants';

export type FetchListCandlesticksParams = {
  tokenAddress: string;
  timeframe: '1min' | '5min';
  startTime?: number;
  endTime?: number;
};

async function fetchListCandlesticks({
  tokenAddress,
  timeframe,
  startTime,
  endTime,
}: FetchListCandlesticksParams) {
  try {
    const queryParams = new URLSearchParams();
    if (tokenAddress) queryParams.append('tokenAddress', tokenAddress);
    if (timeframe) queryParams.append('timeframe', timeframe);
    if (startTime) queryParams.append('startTime', startTime.toString());
    if (endTime) queryParams.append('endTime', endTime.toString());
    const response = await fetch(
      `${API_URL.CANDLESTICKS}?${queryParams.toString()}`,
    );
    const data = await response.json();
    return data;
  } catch (error) {
    toast.error('Fetch list comment failed');
  }
}

export { fetchListCandlesticks };

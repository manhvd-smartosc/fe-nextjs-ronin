import {
  fetchListCandlesticks,
  FetchListCandlesticksParams,
} from '@/apis/candlesticks';
import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchListCandlesticks', () => {
  const defaultParams = {
    tokenAddress: '0xf226edfed279d5369eb13cdec6a358d5d201d050',
    timeframe: '1min' as const,
    startTime: 1609459200,
    endTime: 1609462800,
  };

  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should fetch candlesticks with correct query parameters', async () => {
    const mockResponse = [{ time: 1609459200, open: 1.0, close: 1.5 }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchListCandlesticks(defaultParams);

    const expectedQuery = new URLSearchParams({
      tokenAddress: defaultParams.tokenAddress,
      timeframe: defaultParams.timeframe,
      startTime: defaultParams.startTime.toString(),
      endTime: defaultParams.endTime.toString(),
    }).toString();

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL.CANDLESTICKS}?${expectedQuery}`,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle optional parameters gracefully', async () => {
    const params = {
      tokenAddress: '0xf226edfed279d5369eb13cdec6a358d5d201d050',
      timeframe: '5min',
    } as FetchListCandlesticksParams;
    const mockResponse = [{ time: 1609459200, open: 1.0, close: 1.5 }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchListCandlesticks(params);

    const expectedQuery = new URLSearchParams({
      tokenAddress: params.tokenAddress,
      timeframe: params.timeframe,
    }).toString();

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL.CANDLESTICKS}?${expectedQuery}`,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetchListCandlesticks(defaultParams);

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch list comment failed');
  });

  it('should handle non-JSON responses gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
    });

    const result = await fetchListCandlesticks(defaultParams);

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch list comment failed');
  });

  it('should not append undefined query parameters', async () => {
    const params = {
      tokenAddress: '0xf226edfed279d5369eb13cdec6a358d5d201d050',
      timeframe: '5min',
    } as FetchListCandlesticksParams;
    const mockResponse = [{ time: 1609459200, open: 1.0, close: 1.5 }];
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    await fetchListCandlesticks(params);

    const expectedQuery = new URLSearchParams({
      tokenAddress: params.tokenAddress,
      timeframe: params.timeframe,
    }).toString();

    expect(mockFetch).toHaveBeenCalledWith(`${API_URL.CANDLESTICKS}?${expectedQuery}`);
  });
});

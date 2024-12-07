import { fetchTokenList, getTokenDetail } from '@/apis/token';
import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchTokenList', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should fetch token list with correct query parameters', async () => {
    const params = {
      searchTerm: 'token',
      sortDirection: 'asc',
      sortBy: 'name',
      createdBy: 'user123',
      page: 1,
      limit: 10,
    };
    const mockResponse = { tokens: [{ id: 1, name: 'Token1' }] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchTokenList(params);

    const expectedUrl = `${API_URL.TOKEN}?searchTerm=token&sortDirection=asc&sortBy=name&createdBy=user123&page=1&limit=10`;
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetchTokenList({});

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Get list token failed');
  });
});

describe('getTokenDetail', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should fetch token detail with correct URL', async () => {
    const tokenAddress = '0x123456789abcdef';
    const mockResponse = { id: 1, name: 'Token1' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await getTokenDetail(tokenAddress);

    expect(mockFetch).toHaveBeenCalledWith(`${API_URL.TOKEN}/${tokenAddress}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await getTokenDetail('0x123456789abcdef');

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Get token detail failed');
  });
});

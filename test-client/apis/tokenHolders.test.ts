import { fetchListTokenHolders } from '@/apis/tokenHolders';
import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchListTokenHolders', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should fetch token holders with correct query parameters', async () => {
    const params = {
      holderAddress: '0x123',
      tokenAddress: '0xabc',
      sortDirection: 'asc',
      sortBy: 'balance',
      page: 1,
      limit: 20,
    };
    const mockResponse = { holders: [{ address: '0x123', balance: 100 }] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchListTokenHolders(params);

    const expectedUrl = `${API_URL.TOKEN_HOLDERS}?holderAddress=0x123&tokenAddress=0xabc&page=1&limit=20&sortDirection=asc&sortBy=balance`;
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockResponse);
  });

  it('should fetch token holders without optional parameters', async () => {
    const mockResponse = { holders: [{ address: '0x456', balance: 50 }] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchListTokenHolders({});

    expect(mockFetch).toHaveBeenCalledWith(`${API_URL.TOKEN_HOLDERS}?`);
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetchListTokenHolders({});

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch list holders failed');
  });

  it('should handle non-JSON responses gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
    });

    const result = await fetchListTokenHolders({});

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch list holders failed');
  });
});

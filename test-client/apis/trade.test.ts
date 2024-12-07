import { fetchListTrade } from '@/apis/trade';
import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchListTrade', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should fetch trades with correct query parameters', async () => {
    const params = {
      createdBy: 'user123',
      tokenId: 'token456',
      page: 1,
      limit: 10,
    };
    const mockResponse = { trades: [{ id: 'trade1', createdBy: 'user123' }] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchListTrade(params);

    const expectedUrl = `${API_URL.TRADE}?createdBy=user123&tokenId=token456&page=1&limit=10`;
    expect(mockFetch).toHaveBeenCalledWith(expectedUrl);
    expect(result).toEqual(mockResponse);
  });

  it('should fetch trades without optional parameters', async () => {
    const mockResponse = { trades: [] };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchListTrade({});

    expect(mockFetch).toHaveBeenCalledWith(`${API_URL.TRADE}?`);
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetchListTrade({});

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch list comment failed');
  });

  it('should handle non-JSON responses gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
    });

    const result = await fetchListTrade({});

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch list comment failed');
  });
});

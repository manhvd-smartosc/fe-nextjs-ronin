import { generateNonce } from '@/apis/auth';
import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('generateNonce', () => {
  const address = '0xd44d7d34682b8041f66a8ed6c8656d68125a98cc';

  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should call the API with the correct parameters and return the data on success', async () => {
    const mockResponse = { nonce: '12345' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await generateNonce({ address });

    expect(mockFetch).toHaveBeenCalledWith(API_URL.GENERATE_NONCE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicAddress: address }),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle API failures and show a toast error', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await generateNonce({ address });

    expect(mockFetch).toHaveBeenCalledWith(API_URL.GENERATE_NONCE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicAddress: address }),
    });
    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Generate nonce failed');
  });

  it('should handle non-JSON responses gracefully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockRejectedValueOnce(new Error('Invalid JSON')),
    });

    const result = await generateNonce({ address });

    expect(mockFetch).toHaveBeenCalledWith(API_URL.GENERATE_NONCE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicAddress: address }),
    });
    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Generate nonce failed');
  });
});

import { fetchProfileDetail, updateProfile } from '@/apis/profile';
import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchProfileDetail', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should fetch profile details with correct URL', async () => {
    const address = '0xd44d7d34682b8041f66a8ed6c8656d68125a98cc';
    const mockResponse = { name: 'John Doe', bio: 'Developer' };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchProfileDetail({ address });

    expect(mockFetch).toHaveBeenCalledWith(`${API_URL.PROFILE}/${address}`);
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetchProfileDetail({ address: '0xd44d7d34682b8041f66a8ed6c8656d68125a98cc' });

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch profile failed');
  });
});

describe('updateProfile', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();

    // Mock the File constructor
    global.File = class {
      constructor(
        public parts: string[],
        public name: string,
        public options: { type: string },
      ) {}
    } as unknown as typeof File;
  });

  it('should update profile with correct form data', async () => {
    const params = {
      name: 'Jane Doe',
      bio: 'Engineer',
      file: new File(['content'], 'profile.png', { type: 'image/png' }),
    };
    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await updateProfile(params);

    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('bio', params.bio);
    formData.append('file', params.file);

    expect(mockFetch).toHaveBeenCalledWith(API_URL.PROFILE, {
      method: 'PUT',
      body: expect.any(FormData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    const params = {
      name: 'Jane Doe',
      bio: 'Engineer',
      file: new File(['content'], 'profile.png', { type: 'image/png' }),
    };

    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await updateProfile(params);

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Update profile failed');
  });
});

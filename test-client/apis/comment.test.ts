import { fetchListComment, postComment } from '@/apis/comment';
import { API_URL } from '@/constants';
import { toast } from 'react-toastify';

jest.mock('react-toastify', () => ({
  toast: {
    error: jest.fn(),
  },
}));

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchListComment', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();
  });

  it('should fetch comments with correct query parameters', async () => {
    const params = {
      createdBy: '0xd44d7d34682b8041f66a8ed6c8656d68125a98cc',
      tokenId: '999',
      page: 1,
      limit: 10,
    };
    const mockResponse = {
      items: [
        {
          id: '191',
          userId: '0xd44d7d34682b8041f66a8ed6c8656d68125a98cc',
          tokenId: '5941',
          text: 'Occaecati dolore vitae. Adipisci accusantium sed ipsa mollitia atque. Rerum voluptates voluptate.',
          imageUrl: '',
          createdAt: '2024-12-07T09:08:35.277Z',
          user: {
            id: '0xd44d7d34682b8041f66a8ed6c8656d68125a98cc',
            name: '',
            avatarUrl: '',
            address: '0xd44d7d34682b8041f66a8ed6c8656d68125a98cc',
            createdAt: '2024-12-06T18:36:33.865Z',
            bio: null,
            lastUpdatedName: null,
          },
          token: {
            address: '0xf226edfed279d5369eb13cdec6a358d5d201d050',
          },
        },
      ],
      pagination: {
        total: 1,
        pagesCount: 1,
        currentPage: 1,
        perPage: 12,
        from: 1,
        to: 1,
        hasMore: false,
      },
    };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await fetchListComment(params);

    const expectedQuery = new URLSearchParams({
      createdBy: params.createdBy,
      tokenId: params.tokenId,
      page: params.page.toString(),
      limit: params.limit.toString(),
    }).toString();

    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL.COMMENT}?${expectedQuery}`,
    );
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await fetchListComment({ tokenId: '999' });

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Fetch list comment failed');
  });
});

describe('postComment', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    (toast.error as jest.Mock).mockClear();

    global.File = class {
      constructor(
        public parts: string[],
        public name: string,
        public options: { type: string },
      ) {}
    } as unknown as typeof File;
  });

  it('should post a comment with correct form data', async () => {
    const params = {
      tokenId: '999',
      content: 'Great post!',
      file: new File(['content'], 'image.png', { type: 'image/png' }),
    };
    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await postComment(params);

    const formData = new FormData();
    formData.append('tokenId', params.tokenId);
    formData.append('text', params.content);
    formData.append('file', params.file);

    expect(mockFetch).toHaveBeenCalledWith(API_URL.COMMENT, {
      method: 'POST',
      body: expect.any(FormData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should handle missing file gracefully', async () => {
    const params = {
      tokenId: '999',
      content: 'Nice post!',
      file: null,
    };
    const mockResponse = { success: true };
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockResponse),
    });

    const result = await postComment(params);

    expect(mockFetch).toHaveBeenCalledWith(API_URL.COMMENT, {
      method: 'POST',
      body: expect.any(FormData),
    });
    expect(result).toEqual(mockResponse);
  });

  it('should call toast.error on fetch failure', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network Error'));

    const result = await postComment({
      tokenId: '999',
      content: 'Error post',
    });

    expect(result).toBeUndefined();
    expect(toast.error).toHaveBeenCalledWith('Update profile failed');
  });
});

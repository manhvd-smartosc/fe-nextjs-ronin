import uploadFile from '@/apis/upload';
import axios from 'axios';

jest.mock('axios');

// Mock the File constructor
global.File = class {
  constructor(
    public parts: string[],
    public name: string,
    public options: { type: string },
  ) {}
} as unknown as typeof File;

describe('uploadFile', () => {
  const mockFile = new File(['file content'], 'example.txt', {
    type: 'text/plain',
  });

  beforeEach(() => {
    (axios.post as jest.Mock).mockClear();
  });

  it('should upload a file and return data', async () => {
    const mockResponse = {
      data: { ipfsUrl: 'https://ipfs.example.com/file123' },
    };
    (axios.post as jest.Mock).mockResolvedValueOnce(mockResponse);
    const result = await uploadFile(mockFile);
    expect(axios.post).toHaveBeenCalledWith(
      '/api/uploads/ipfs',
      expect.any(FormData),
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw an error if the upload fails', async () => {
    (axios.post as jest.Mock).mockRejectedValueOnce(new Error('Upload failed'));
    await expect(uploadFile(mockFile)).rejects.toThrow('Error uploading file');
  });
});

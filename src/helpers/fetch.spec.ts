import fetch from './fetch';

describe('fetch', () => {
  test('should make a GET request with default options', async () => {
    const url = 'https://example.com';
    const mockResponse = new Response(null, { status: 200 });

    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockResolvedValueOnce(mockResponse);

    const response = await fetch(url);
    expect(response).toBe(mockResponse);

    fetchSpy.mockRestore();
  });

  test('should throw an error for non-2xx status codes', async () => {
    const url = 'https://example.com';
    const mockResponse = new Response(null, { status: 400 });

    const fetchSpy = jest.spyOn(global, 'fetch');
    fetchSpy.mockResolvedValueOnce(mockResponse);

    await expect(fetch(url)).rejects.toEqual(mockResponse);

    fetchSpy.mockRestore();
  });
});

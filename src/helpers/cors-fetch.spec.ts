import corsFetch from './cors-fetch';

describe('corsFetch', () => {
  test('should make a successful CORS request', async () => {
    const originalGM_xmlhttpRequest = global.GM_xmlhttpRequest;
    global.GM_xmlhttpRequest = vi.fn();

    (GM_xmlhttpRequest as vi.mock).mockImplementationOnce((config) => {
      config.onload({
        status: 200,
        responseText: '{"message": "Success"}'
      });
    });

    const response = await corsFetch('https://example.com/api');
    expect(response.status).toBe(200);
    expect(response.responseText).toEqual('{"message": "Success"}');

    global.GM_xmlhttpRequest = originalGM_xmlhttpRequest;
  });

  test('should handle an error during the CORS request', async () => {
    const originalGM_xmlhttpRequest = global.GM_xmlhttpRequest;
    global.GM_xmlhttpRequest = vi.fn();

    (GM_xmlhttpRequest as vi.mock).mockImplementationOnce((config) => {
      config.onerror(new Error('Request failed'));
    });

    await expect(corsFetch('https://example.com/api')).rejects.toThrow('Request failed');

    global.GM_xmlhttpRequest = originalGM_xmlhttpRequest;
  });
});

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

  test('should merge partial options with the defaults instead of replacing them', async () => {
    const originalGM_xmlhttpRequest = global.GM_xmlhttpRequest;
    global.GM_xmlhttpRequest = vi.fn();

    let capturedConfig: Record<string, unknown>;
    (GM_xmlhttpRequest as vi.mock).mockImplementationOnce((config) => {
      capturedConfig = config;
      config.onload({ status: 200, responseText: '{}' });
    });

    await corsFetch('https://example.com/api', { headers: { 'X-Test': 'value' } });

    // method and fetch should still come from the defaults even though only headers was supplied
    expect(capturedConfig.method).toBe('GET');
    expect(capturedConfig.fetch).toBe(true);
    expect(capturedConfig.headers).toEqual({ 'X-Test': 'value' });

    global.GM_xmlhttpRequest = originalGM_xmlhttpRequest;
  });
});

import { fetchOk } from './fetch-ok';

describe('fetchOk', () => {
  const url = 'https://example.com';

  test('should leave the request to fetch when given no options', async () => {
    const response = new Response(null, { status: 200 });
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    expect(await fetchOk(url)).toBe(response);
    expect(fetchSpy).toHaveBeenCalledExactlyOnceWith(url, undefined);
  });

  test("should send the caller's options as they are", async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response(null, { status: 204 }));
    const headers = new Headers({ 'x-a': '1' });

    const options = { method: 'HEAD', headers };

    await fetchOk(url, options);

    // The caller's own options, not just equal ones (an equality check can't tell two Headers apart)
    expect(fetchSpy).toHaveBeenCalledOnce();
    expect(fetchSpy.mock.calls[0][1]).toBe(options);
  });

  test.each([300, 400, 500])('should throw the response for a %s status', async (status) => {
    const response = new Response(null, { status });
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(fetchOk(url)).rejects.toBe(response);
  });

  test('should throw the response for a status under 200', async () => {
    // A Response can't be made with a status under 200, so it's read through a stand-in
    const response = new Response(null, { status: 200 });
    Object.defineProperty(response, 'status', { value: 199 });
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(response);

    await expect(fetchOk(url)).rejects.toBe(response);
  });
});

export default async (
  url: string,
  options: Tampermonkey.Request<unknown> = { url, method: 'GET', fetch: true }
): Promise<Tampermonkey.Response<unknown>> =>
  new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...options,
      onload: (response: Tampermonkey.Response<unknown>) => resolve(response),
      onerror: (error: Tampermonkey.ErrorResponse) => reject(error)
    });
  });

export default async (
  url: string,
  options: Partial<Tampermonkey.Request<unknown>> = {}
): Promise<Tampermonkey.Response<unknown>> =>
  new Promise((resolve, reject) => {
    const opts = Object.assign({ url, method: 'GET', fetch: true }, options);

    GM_xmlhttpRequest({
      ...opts,
      onload: (response: Tampermonkey.Response<unknown>) => resolve(response),
      onerror: (error: Tampermonkey.ErrorResponse) => reject(error)
    });
  });

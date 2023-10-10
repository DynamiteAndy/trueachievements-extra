export default async (
  url: string,
  options: Tampermonkey.Request<unknown> = {
    url: ''
  }
): Promise<Tampermonkey.Response<unknown>> => {
  options.url = url;

  const opts = Object.assign(
    {
      method: 'GET',
      fetch: true
    },
    options
  );

  return new Promise((resolve, reject) => {
    GM_xmlhttpRequest({
      ...opts,
      onload: (response: Tampermonkey.Response<unknown>) => resolve(response),
      onerror: (error: Tampermonkey.ErrorResponse) => reject(error)
    });
  });
};

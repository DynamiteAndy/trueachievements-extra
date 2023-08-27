export default async (url: string, options: RequestInit = {}): Promise<Response> => {
  const opts = Object.assign(
    {
      headers: new Headers(),
      method: 'GET'
    },
    options
  );

  const response = await fetch(url, opts);

  if (response.status < 200 || response.status >= 300) {
    throw response;
  }

  return response;
};

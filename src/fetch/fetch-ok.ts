// A fetch of a page we expect to load: it throws the response when its status isn't 2xx, so a 404 or 403
// is an error to catch rather than a page to read
export const fetchOk = async (url: string, options?: RequestInit): Promise<Response> => {
  const response = await fetch(url, options);

  if (response.status < 200 || response.status >= 300) {
    throw response;
  }

  return response;
};

export default async (url: string, options: RequestInit = {}): Promise<Response> => {
  options.headers = options.headers || new Headers();
  options.method = options.method ? options.method.toUpperCase() : 'GET';

  const response = await fetch(url, options);
  return response;
};

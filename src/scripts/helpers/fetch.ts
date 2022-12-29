const parseJSON = (response: Response) => response.json().catch(() => response);
const parseHTML = (response: Response) => {
  response.text().then((body: string) => {
    const parser = new DOMParser();
    return parser.parseFromString(body, 'text/html');
  }).catch(() => response);  
};

export const fetchHelper = async(url: string, options: any = {}): Promise<Response> => {
  options.headers = options.headers || new Headers();
  options.method = (options.method) ? options.method.toUpperCase() : 'GET';

  const response = await fetch(url, options);
  return response;
};

export const JSONFetch = async(url: string, options: any = {}) => {
  const response = await fetchHelper(url, options);

  return parseJSON(response);
};

export const HTMLFetch = async(url: string, options: any = {}) => {
  const response = await fetchHelper(url, options);

  return parseHTML(response);
};
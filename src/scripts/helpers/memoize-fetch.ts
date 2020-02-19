const cachedCalls: Map<string, Promise<Response>> = new Map();

export default (url: string) : Promise<Response> => {
  if (cachedCalls.has(url)) return cachedCalls.get(url);
  cachedCalls.set(url, fetch(url));
  return cachedCalls.get(url);
};

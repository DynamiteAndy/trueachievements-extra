const originalUrlConstructor = globalThis.URL;

(global.URL as unknown) = function (url: string, base?: string): URL {
  // If base is provided, resolve url relative to base
  if (base) {
    return new originalUrlConstructor(url, base);
  }

  // If url starts with 'http://' or 'https://', return as is
  if (url.startsWith('http://') || url.startsWith('https://') || url === 'about:blank') {
    return new originalUrlConstructor(url);
  } else {
    // If it's a pathname, prepend with default domain
    return new originalUrlConstructor(url, 'https://example.com');
  }
};

class MockURL extends URL {
  constructor(url: string, base?: string) {
    if (!base) {
      if (url.startsWith('http://') || url.startsWith('https://') || url === 'about:blank') {
        super(url);
      } else if (url.startsWith('file:///')) {
        const relativePath = url.replace(/^file:\/\/\/(?:[A-Z]:\/)?/i, '');
        super(relativePath, 'https://example.com');
      } else {
        super(url, 'https://example.com');
      }
    } else {
      super(url, base);
    }
  }
}

vi.stubGlobal('URL', MockURL);

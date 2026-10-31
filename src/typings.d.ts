declare module '*.scss' {
  const value: string;
  export default value;
}

// Rendered to HTML at build time (build/loaders/markdown-loader.ts)
declare module '*.md' {
  const value: string;
  export default value;
}

// Only the latest version's changes, with a link to the whole changelog
declare module '*.md?latest' {
  const value: string;
  export default value;
}

// The intro, then each top-level section's title and HTML (the feature documentation's settings tabs)
declare module '*.md?sections' {
  const value: { intro: string; sections: { title: string; html: string }[] };
  export default value;
}

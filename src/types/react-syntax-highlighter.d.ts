declare module 'react-syntax-highlighter' {
  import * as React from 'react';
  export const Prism: React.ComponentType<Record<string, unknown>>;
}

declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  const styles: Record<string, unknown>;
  export = styles;
}

declare module 'react-syntax-highlighter/dist/esm/languages/prism' {
  const languages: Record<string, unknown>;
  export = languages;
}
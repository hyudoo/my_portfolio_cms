'use client';

import { createCache, extractStyle, StyleProvider } from '@ant-design/cssinjs';
import { useServerInsertedHTML } from 'next/navigation';
import { PropsWithChildren, useState } from 'react';

export const RootStylesRegistry: React.FC<PropsWithChildren> = ({ children }) => {
  const [cache] = useState(() => createCache());

  useServerInsertedHTML(() => {
    return (
      <style dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }} />
    );
  });

  return <StyleProvider cache={cache}>{children}</StyleProvider>;
};

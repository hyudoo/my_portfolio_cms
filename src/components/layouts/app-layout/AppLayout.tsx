'use client';

import { ReactNode, useEffect } from 'react';
import { NotifyProvider } from '../../notify-provider/NotifyProvider';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { StorageKey } from '../../../enums/storage-key.enum';
import { polyfillTailwindGap } from '../../../utils/polyfill.util';
import { ModalProvider } from './modal-provider/ModalProvider';

export function AppLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    polyfillTailwindGap();
  }, []);

  useEffect(() => {
    const listener = (e: StorageEvent) => {
      if (e.key === StorageKey.AuthChanged) {
        window.location.reload();
      }
    };

    window.addEventListener('storage', listener);
    return () => {
      window.removeEventListener('storage', listener);
    };
  }, []);

  return (
    <Provider store={store}>
      <ModalProvider>
        <NotifyProvider>{children}</NotifyProvider>
      </ModalProvider>
    </Provider>
  );
}

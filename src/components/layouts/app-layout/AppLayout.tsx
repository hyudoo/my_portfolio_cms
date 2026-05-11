'use client';

import { ReactNode, useEffect } from 'react';
import { ConfigProvider, Modal, theme as antdTheme } from 'antd';
import { useTheme } from 'next-themes';
import enUS from 'antd/locale/en_US';
import viVN from 'antd/locale/vi_VN';
import { useLocale } from 'next-intl';
import { NotifyProvider } from '../../notify-provider/NotifyProvider';
import { RootStylesRegistry } from '../../root-styles-registry/RootStylesRegistry';
import { Provider } from 'react-redux';
import { store } from '../../../redux/store';
import { StorageKey } from '../../../enums/storage-key.enum';
import { polyfillTailwindGap } from '../../../utils/polyfill.util';
import { ModalProvider } from './modal-provider/ModalProvider';

const antdLocaleMap: Record<string, typeof enUS> = { en: enUS, vi: viVN };

function AntdConfigProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const locale = useLocale();

  return (
    <ConfigProvider
      locale={antdLocaleMap[locale]}
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: '#38bdf8',
          borderRadius: 8,
        },
        components: {
          Layout: {
            siderBg: isDark ? '#111827' : '#f8fafc',
            headerBg: isDark ? '#111827' : '#ffffff',
            bodyBg: isDark ? '#030712' : '#f1f5f9',
          },
          Menu: {
            darkItemBg: 'transparent',
            darkItemSelectedBg: '#0284c7',
            itemSelectedBg: '#e0f2fe',
            itemSelectedColor: '#0284c7',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}

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
    <RootStylesRegistry>
      <AntdConfigProvider>
        <Provider store={store}>
          <ModalProvider>
            <NotifyProvider>{children}</NotifyProvider>
          </ModalProvider>
        </Provider>
      </AntdConfigProvider>
    </RootStylesRegistry>
  );
}

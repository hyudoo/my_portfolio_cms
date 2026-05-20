'use client';

import * as Toast from '@radix-ui/react-toast';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { apiNotify } from './api-notify/apiNotify';
import { useTranslations } from 'next-intl';
import clsx from 'clsx';
import { X } from 'lucide-react';

export type NotifyOptions = {
  duration?: number;
};

type NotifyType = (content: string, options?: NotifyOptions) => void;

export const notify: {
  info: NotifyType;
  success: NotifyType;
  error: NotifyType;
  warning: NotifyType;
  loading: NotifyType;
} = {
  info: () => {},
  success: () => {},
  error: () => {},
  warning: () => {},
  loading: () => {},
};

type ToastType = 'info' | 'success' | 'error' | 'warning' | 'loading';

type ToastItem = {
  id: number;
  content: string;
  type: ToastType;
  duration: number;
  open: boolean;
};

let toastCounter = 0;

const TOAST_BG: Record<ToastType, string> = {
  info: 'bg-sky-500',
  success: 'bg-emerald-500',
  error: 'bg-red-500',
  warning: 'bg-amber-500',
  loading: 'bg-sky-500',
};

type NotifyProviderProps = { children?: ReactNode };

export const NotifyProvider: React.FC<NotifyProviderProps> = ({ children }) => {
  const t = useTranslations();
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, content: string, duration = 3000) => {
    const id = toastCounter++;
    setToasts((prev) => [...prev, { id, content, type, duration, open: true }]);
  }, []);

  useEffect(() => {
    apiNotify.error = (code: string) => {
      addToast('error', t(code));
    };

    notify.info = (content, options = {}) => addToast('info', content, (options.duration ?? 3) * 1000);
    notify.success = (content, options = {}) => addToast('success', content, (options.duration ?? 3) * 1000);
    notify.error = (content, options = {}) => addToast('error', content, (options.duration ?? 3) * 1000);
    notify.warning = (content, options = {}) => addToast('warning', content, (options.duration ?? 3) * 1000);
    notify.loading = (content, options = {}) => addToast('loading', content, ((options.duration ?? 0) || 30) * 1000);
  }, [t, addToast]);

  return (
    <Toast.Provider swipeDirection="right">
      {children}
      {toasts.map(({ id, content, type, duration, open }) => (
        <Toast.Root
          key={id}
          open={open}
          duration={duration}
          onOpenChange={(val) => {
            if (!val) setToasts((prev) => prev.filter((item) => item.id !== id));
          }}
          className={clsx(
            'flex items-center justify-between gap-3 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[swipe=end]:animate-out data-[state=closed]:fade-out-80',
            'data-[state=open]:slide-in-from-bottom-2',
            TOAST_BG[type],
          )}
        >
          <Toast.Description>{content}</Toast.Description>
          <Toast.Close asChild>
            <button className="shrink-0 opacity-70 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </Toast.Close>
        </Toast.Root>
      ))}
      <Toast.Viewport className="fixed bottom-4 right-4 z-9999 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)] list-none outline-none" />
    </Toast.Provider>
  );
};

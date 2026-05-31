'use client';

import React, { ReactNode, useEffect } from 'react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { apiNotify } from './api-notify/apiNotify';
import { useTranslations } from 'next-intl';

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
  info: (c, o = {}) => toast.info(c, { duration: (o.duration ?? 3) * 1000 }),
  success: (c, o = {}) => toast.success(c, { duration: (o.duration ?? 3) * 1000 }),
  error: (c, o = {}) => toast.error(c, { duration: (o.duration ?? 3) * 1000 }),
  warning: (c, o = {}) => toast.warning(c, { duration: (o.duration ?? 3) * 1000 }),
  loading: (c, o = {}) => toast.loading(c, { duration: ((o.duration ?? 0) || 30) * 1000 }),
};

export const NotifyProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const t = useTranslations();

  useEffect(() => {
    apiNotify.error = (code: string) => {
      try {
        toast.error(t(code as Parameters<typeof t>[0]));
      } catch {
        toast.error(t('api_error.999999'));
      }
    };
  }, [t]);

  return (
    <>
      {children}
      <Toaster richColors position="bottom-right" />
    </>
  );
};

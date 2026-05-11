"use client";

import { message } from "antd";
import React, { ReactNode, useEffect } from "react";
import { apiNotify } from "./api-notify/apiNotify";
import { useTranslations } from "next-intl";

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

type NotifyProviderProps = {
  children?: ReactNode;
};

export const NotifyProvider: React.FC<NotifyProviderProps> = ({ children }) => {
  const t = useTranslations();

  useEffect(() => {
    apiNotify.error = (code: string) => {
      message.error(t(code));
    };

    notify.info = (content: string, options = {}) => {
      message.info(content, options.duration);
    };
    notify.success = (content: string, options = {}) => {
      message.success(content, options.duration);
    };
    notify.error = (content: string, options = {}) => {
      message.error(content, options.duration);
    };
    notify.warning = (content: string, options = {}) => {
      message.warning(content, options.duration);
    };
    notify.loading = (content: string, options = {}) => {
      message.loading(content, options.duration);
    };
  }, [t]);

  return <>{children}</>;
};

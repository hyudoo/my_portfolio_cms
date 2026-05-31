'use client';

import * as Dialog from '@radix-ui/react-dialog';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';
import { ReactNode } from 'react';

export type AppModalProps = {
  open?: boolean;
  title?: ReactNode;
  children?: ReactNode;
  onOk?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  onCancel?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  onClose?: (e?: React.MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  okText?: string;
  cancelText?: string;
  okButtonProps?: { loading?: boolean; hidden?: boolean; disabled?: boolean };
  cancelButtonProps?: { loading?: boolean; hidden?: boolean };
  centered?: boolean;
  className?: string;
  icon?: ReactNode;
  width?: string | number;
  footer?: ReactNode | null;
};

export const AppModal: React.FC<AppModalProps> = ({
  open,
  title,
  children,
  onOk,
  onCancel,
  onClose,
  okText: _okText,
  cancelText: _cancelText,
  okButtonProps,
  cancelButtonProps,
  className,
  icon,
  width = 520,
  footer,
}) => {
  const t = useTranslations();
  const okText = _okText ?? t('common.yes');
  const cancelText = _cancelText ?? t('common.cancel');
  const handleClose = () => (onClose ?? onCancel)?.();

  return (
    <Dialog.Root open={open}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
        <Dialog.Content
          className={clsx(
            'fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-xl overflow-hidden',
            'bg-card text-card-foreground',
            className,
          )}
          style={{ width, maxWidth: 'calc(100vw - 32px)' }}
          onInteractOutside={(e) => e.preventDefault()}
          aria-describedby={undefined}
        >
          {/* Header */}
          <div
            className={clsx(
              'flex items-center justify-between px-12 py-5',
              icon ? 'bg-card' : 'bg-sky-600',
            )}
          >
            <Dialog.Title
              className={clsx(
                'font-semibold text-base flex items-center gap-2',
                icon ? 'text-card-foreground' : 'text-white',
              )}
            >
              {icon && <span className="icon">{icon}</span>}
              {title}
            </Dialog.Title>
            <button
              onClick={handleClose}
              className={clsx(
                'p-1 rounded transition-colors',
                icon
                  ? 'text-muted-foreground hover:text-foreground'
                  : 'text-white/80 hover:text-white',
              )}
            >
              <X size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="px-12 py-10">{children}</div>

          {/* Footer */}
          {footer !== null && (
            <div className="px-10 pb-10 flex gap-2">
              {footer ?? (
                <>
                  {!cancelButtonProps?.hidden && (
                    <button
                      onClick={onClose ?? onCancel}
                      className="flex-1 h-13.5 px-4 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    >
                      {cancelText}
                    </button>
                  )}
                  {!okButtonProps?.hidden && (
                    <button
                      onClick={onOk}
                      disabled={okButtonProps?.disabled || okButtonProps?.loading}
                      className="flex-1 h-13.5 px-4 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {okButtonProps?.loading && (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      )}
                      {okText}
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

'use client';

import { Modal, ModalProps } from 'antd';
import { ButtonProps } from 'antd/lib';
import classNames from 'classnames';
import { useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { CloseOutlined } from '@ant-design/icons';

export type AppModalProps = ModalProps & {
  onClose?: ModalProps['onCancel'];
};

export const AppModal: React.FC<AppModalProps> = (props) => {
  const {
    className: _className,
    okText: _okText,
    cancelText: _cancelText,
    cancelButtonProps: _cancelButtonProps,
    onCancel,
    onClose,
    ...otherProps
  } = props;

  const t = useTranslations();

  const className = useMemo(() => classNames('app-modal', _className), [_className]);
  const okText = useMemo(() => _okText ?? t('common.yes'), [_okText, t]);
  const cancelText = useMemo(() => _cancelText ?? t('common.cancel'), [_cancelText, t]);
  const cancelButtonProps = useMemo<ButtonProps>(
    () => ({
      onClick: (e) => (onCancel ?? onClose)?.(e as React.MouseEvent<HTMLButtonElement>),
      ..._cancelButtonProps,
    }),
    [_cancelButtonProps, onCancel, onClose],
  );

  return (
    <Modal
      className={className}
      okText={okText}
      cancelText={cancelText}
      cancelButtonProps={cancelButtonProps}
      onCancel={onClose ?? onCancel}
      maskClosable={false}
      closeIcon={<CloseOutlined color="white" size={24} />}
      {...otherProps}
    />
  );
};

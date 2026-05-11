'use client';

import { AppModalProps } from './app-modal/AppModal';
import useModal, { HookAPI } from 'antd/es/modal/useModal';
import { createContext, FC, PropsWithChildren, useContext, useMemo, useRef, useState } from 'react';
import { AppModal } from './app-modal/AppModal';

type ModalContextProps = HookAPI & {
  show: (newModal: AppModalProps) => number;
  close: (id: number) => void;
};

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const useAppModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useAppModal must be used within a ModalProvider');
  }
  return context;
};

type ProviderModalProps = AppModalProps & { id: number };

type ModalProviderProps = PropsWithChildren;

export const ModalProvider: FC<ModalProviderProps> = ({ children }) => {
  const [modal, contextHolder] = useModal();

  const [modals, setModals] = useState<ProviderModalProps[]>([]);

  const idRef = useRef(0);
  const appModal = useMemo<ModalContextProps>(() => {
    return {
      ...modal,
      show: (newModal: AppModalProps) => {
        newModal.centered ??= true;

        const id = idRef.current++;

        const closeModal = () => {
          setModals((prev) => prev.map((e) => (e.id === id ? { ...e, open: false } : e)));
          setTimeout(() => setModals((prev) => prev.filter((e) => e.id !== id)), 2000);
        };

        const handleClose: AppModalProps['onClose'] = (e) => {
          closeModal();
          newModal.onClose?.(e);
        };

        const handleOk: AppModalProps['onOk'] = async (e) => {
          try {
            const res = newModal.onOk?.(e);
            if ((res as any) instanceof Promise) {
              setModals((prev) =>
                prev.map((e) => (e.id === id ? { ...e, okButtonProps: { ...e.okButtonProps, loading: true } } : e)),
              );
              await res;
            }
            closeModal();
          } catch (e: unknown) {
            console.error(e);
          } finally {
            setModals((prev) =>
              prev.map((e) => (e.id === id ? { ...e, okButtonProps: { ...e.okButtonProps, loading: false } } : e)),
            );
          }
        };

        const handleCancel: AppModalProps['onCancel'] = async (e) => {
          try {
            const res = newModal.onCancel?.(e);
            if ((res as any) instanceof Promise) {
              setModals((prev) =>
                prev.map((e) =>
                  e.id === id ? { ...e, cancelButtonProps: { ...e.cancelButtonProps, loading: true } } : e,
                ),
              );
              await res;
            }
            closeModal();
          } catch (e: unknown) {
            console.error(e);
          } finally {
            setModals((prev) =>
              prev.map((e) =>
                e.id === id ? { ...e, cancelButtonProps: { ...e.cancelButtonProps, loading: false } } : e,
              ),
            );
          }
        };

        setModals((prev) =>
          prev.concat({
            ...newModal,
            id,
            open: true,
            onClose: handleClose,
            onCancel: handleCancel,
            onOk: handleOk,
          }),
        );

        return id;
      },
      close: (id) => {
        setModals((prev) => prev.map((e) => (e.id === id ? { ...e, open: false } : e)));
        setTimeout(() => setModals((prev) => prev.filter((e) => e.id !== id)), 2000);
      },
    };
  }, [modal]);

  return (
    <ModalContext.Provider value={appModal}>
      {children}
      {contextHolder}
      {modals.map((modal) => {
        return <AppModal key={modal.id} {...modal} />;
      })}
    </ModalContext.Provider>
  );
};

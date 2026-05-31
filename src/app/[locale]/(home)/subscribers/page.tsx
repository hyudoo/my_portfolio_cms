'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { TablePagination } from '@/components/common/table-pagination/TablePagination';
import { SubscriberForm } from '@/components/subsciber/subscriber-form/SubscriberForm';
import { SubscribersTable } from '@/components/subsciber/subscribers-table/SubscribersTable';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { subscriberRequest } from '@/requests/subscriber.request';
import { ListSubscribersResponse, SubscriberItem } from '@/types/requests/subscriber.type';
import { parseNumber, parseString, useQuery } from '@/utils/use-query.util';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination.constant';

const queryTypes = {
  keyword: parseString(),
  page: parseNumber(1),
  pageSize: parseNumber(DEFAULT_PAGE_SIZE),
};

export default function SubscribersPage() {
  const t = useTranslations();
  const modal = useAppModal();

  const [data, setData] = useState<ListSubscribersResponse>();
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useQuery(queryTypes);

  const { register, handleSubmit } = useForm({
    defaultValues: { keyword: query.keyword ?? '' },
  });

  const fetchSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      const { page, pageSize, ...rest } = query;
      const res = await subscriberRequest.list({
        skip: (page - 1) * pageSize,
        take: pageSize,
        ...rest,
      });
      setData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  const handleSearchSubmit = handleSubmit(({ keyword }) => {
    setQuery((prev) => ({ ...prev, keyword: keyword.trim() || undefined, page: 1 }));
  });

  const openCreateModal = () => {
    const formDataRef = { current: { email: '', isConfirmed: false } };
    modal.show({
      title: t('subscribers.modal.create_title'),
      children: (
        <SubscriberForm
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.email) {
          notify.error(t('subscribers.validation.email_required'));
          throw new Error('validation');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formDataRef.current.email)) {
          notify.error(t('subscribers.validation.email_invalid'));
          throw new Error('validation');
        }
        const confirmedAt = formDataRef.current.isConfirmed ? new Date().toISOString() : null;
        await subscriberRequest.create({ email: formDataRef.current.email, confirmedAt });
        notify.success(t('subscribers.messages.created'));
        setQuery((prev) => ({ ...prev, page: 0 }));
      },
    });
  };

  const handleEdit = (subscriber: SubscriberItem) => {
    const formDataRef = { current: { email: subscriber.email, isConfirmed: !!subscriber.confirmedAt } };
    modal.show({
      title: t('subscribers.modal.edit_title'),
      children: (
        <SubscriberForm
          initialValue={{ email: subscriber.email, isConfirmed: !!subscriber.confirmedAt }}
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
          isEdit
        />
      ),
      onOk: async () => {
        const confirmedAt = formDataRef.current.isConfirmed
          ? (subscriber.confirmedAt ?? new Date().toISOString())
          : null;
        await subscriberRequest.update(subscriber.id, { confirmedAt });
        notify.success(t('subscribers.messages.updated'));
        await fetchSubscribers();
      },
    });
  };

  const handleDelete = (subscriber: SubscriberItem) => {
    modal.show({
      title: t('subscribers.modal.delete_title'),
      children: (
        <p className="text-sm text-muted-foreground">
          {t('subscribers.modal.delete_confirm', { email: subscriber.email })}
        </p>
      ),
      okText: t('subscribers.modal.delete_ok'),
      onOk: async () => {
        await subscriberRequest.delete({ ids: [subscriber.id] });
        notify.success(t('subscribers.messages.deleted'));
        await fetchSubscribers();
      },
    });
  };

  const totalPages = Math.ceil((data?.total ?? 0) / query.pageSize);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('subscribers.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('subscribers.subtitle')}</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          {t('subscribers.create_btn')}
        </Button>
      </div>

      <Card className="glass border-glass-border">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input className="pl-9" placeholder={t('subscribers.search_placeholder')} {...register('keyword')} />
              </div>
              <Button type="submit" variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            <span className="text-sm text-muted-foreground">
              {t('subscribers.total_count', { count: data?.total ?? 0 })}
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('subscribers.loading')}</div>
          ) : (
            <SubscribersTable
              subscribers={data?.subscribers ?? []}
              skip={(query.page - 1) * query.pageSize}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}

          <TablePagination
            page={query.page}
            pageSize={query.pageSize}
            totalPages={totalPages}
            onPageChange={(n) => setQuery((prev) => ({ ...prev, page: n }))}
            onPageSizeChange={(size) => setQuery((prev) => ({ ...prev, pageSize: size, page: 1 }))}
          />
        </div>
      </Card>
    </div>
  );
}

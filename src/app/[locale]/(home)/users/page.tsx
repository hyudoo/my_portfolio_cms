'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { UserForm } from '@/components/users/user-form/UserForm';
import { UsersTable } from '@/components/users/users-table/UsersTable';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { userRequest } from '@/requests/user.request';
import {
  CreateUserBody,
  ListUsersQuery,
  ListUsersResponse,
  UpdateUserBody,
  UserItem,
} from '@/types/requests/user.type';
import { parseNumber, parseString, useQuery } from '@/utils/use-query.util';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination.constant';
import { TablePagination } from '@/components/common/table-pagination/TablePagination';

const queryTypes = {
  keyword: parseString(),
  page: parseNumber(1),
  pageSize: parseNumber(DEFAULT_PAGE_SIZE),
};

export default function UsersPage() {
  const t = useTranslations();
  const modal = useAppModal();

  const [data, setData] = useState<ListUsersResponse>();
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useQuery(queryTypes);

  const { register, handleSubmit } = useForm({
    defaultValues: { keyword: query.keyword ?? '' },
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { page, pageSize, ...rest } = query;
      const params: ListUsersQuery = {
        skip: (page - 1) * pageSize,
        take: pageSize,
        ...rest,
      };

      const data = await userRequest.list(params);
      setData(data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearchSubmit = handleSubmit(({ keyword }) => {
    setQuery((prev) => ({ ...prev, keyword: keyword.trim() || undefined, page: 1 }));
  });

  const openCreateModal = () => {
    const formDataRef = { current: { username: '', email: '', isActive: true, roles: [] } as Partial<CreateUserBody> };
    modal.show({
      title: t('users.modal.create_title'),
      children: (
        <UserForm
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.username) {
          notify.error(t('users.validation.display_name_required'));
          throw new Error('validation');
        }
        if (!formDataRef.current.email) {
          notify.error(t('users.validation.email_required'));
          throw new Error('validation');
        }
        await userRequest.create(formDataRef.current as CreateUserBody);
        notify.success(t('users.messages.created'));
        setQuery((prev) => ({ ...prev, page: 0 }));
      },
    });
  };

  const handleEdit = (user: UserItem) => {
    const initial: Partial<CreateUserBody> = {
      username: user.username,
      email: user.email,
      isActive: user.isActive,
      roles: user.roles ?? [],
    };
    const formDataRef = { current: initial };
    modal.show({
      title: t('users.modal.edit_title'),
      children: (
        <UserForm
          initialValue={initial}
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
          isEdit
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.username) {
          notify.error(t('users.validation.display_name_required'));
          throw new Error('validation');
        }
        await userRequest.update(user.id, formDataRef.current as UpdateUserBody);
        notify.success(t('users.messages.updated'));
        await fetchUsers();
      },
    });
  };

  const handleDelete = (user: UserItem) => {
    modal.show({
      title: t('users.modal.delete_title'),
      children: (
        <p className="text-sm text-muted-foreground">{t('users.modal.delete_confirm', { username: user.username })}</p>
      ),
      okText: t('users.modal.delete_ok'),
      onOk: async () => {
        await userRequest.softDelete({ ids: [user.id] });
        notify.success(t('users.messages.deleted'));
        await fetchUsers();
      },
    });
  };

  const handleRestore = (user: UserItem) => {
    modal.show({
      title: t('users.modal.restore_title'),
      children: (
        <p className="text-sm text-muted-foreground">{t('users.modal.restore_confirm', { username: user.username })}</p>
      ),
      okText: t('users.modal.restore_ok'),
      onOk: async () => {
        await userRequest.restore({ ids: [user.id] });
        notify.success(t('users.messages.restored'));
        await fetchUsers();
      },
    });
  };

  const totalPages = Math.ceil((data?.total ?? 0) / query.pageSize);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('users.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('users.subtitle')}</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          {t('users.create_btn')}
        </Button>
      </div>

      <Card className="glass border-glass-border">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input className="pl-9" placeholder={t('users.search_placeholder')} {...register('keyword')} />
              </div>
              <Button type="submit" variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            <span className="text-sm text-muted-foreground">{t('users.total_count', { count: data?.total ?? 0 })}</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('users.loading')}</div>
          ) : (
            <UsersTable
              users={data?.users ?? []}
              skip={(query.page - 1) * query.pageSize}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onRestore={handleRestore}
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

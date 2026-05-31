'use client';

import { RoleForm } from '@/components/role/role-form/RoleForm';
import { RolesTable } from '@/components/role/roles-table/RolesTable';
import { TablePagination } from '@/components/common/table-pagination/TablePagination';
import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination.constant';
import { useRouter } from '@/i18n/navigation';
import { roleRequest } from '@/requests/role.request';
import { CreateRoleBody, ListRolesQuery, ListRolesResponse, RoleItem } from '@/types/requests/role.type';
import { parseNumber, parseString, useQuery } from '@/utils/use-query.util';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Search } from 'lucide-react';

const queryTypes = {
  keyword: parseString(),
  page: parseNumber(1),
  pageSize: parseNumber(DEFAULT_PAGE_SIZE),
};

export default function RolesPage() {
  const t = useTranslations();
  const modal = useAppModal();
  const router = useRouter();

  const [data, setData] = useState<ListRolesResponse>();
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useQuery(queryTypes);

  const { register, handleSubmit } = useForm({
    defaultValues: { keyword: query.keyword ?? '' },
  });

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const { page, pageSize, ...rest } = query;
      const params: ListRolesQuery = { skip: (page - 1) * pageSize, take: pageSize, ...rest };
      const res = await roleRequest.list(params);
      setData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const handleSearchSubmit = handleSubmit(({ keyword }) => {
    setQuery((prev) => ({ ...prev, keyword: keyword.trim() || undefined, page: 1 }));
  });

  const openCreateModal = () => {
    const formDataRef = { current: { name: '', isDefault: false } as Partial<CreateRoleBody> };
    modal.show({
      title: t('roles.modal.create_title'),
      children: (
        <RoleForm
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.name) {
          notify.error(t('roles.validation.name_required'));
          throw new Error('validation');
        }
        await roleRequest.create(formDataRef.current as CreateRoleBody);
        notify.success(t('roles.messages.created'));
        setQuery((prev) => ({ ...prev, page: 1 }));
      },
    });
  };

  const handleView = (role: RoleItem) => {
    router.push(`/system/roles/${role.id}`);
  };

  const handleDelete = (role: RoleItem) => {
    modal.show({
      title: t('roles.modal.delete_title'),
      children: <p className="text-sm text-muted-foreground">{t('roles.modal.delete_confirm', { name: role.name })}</p>,
      okText: t('roles.modal.delete_ok'),
      onOk: async () => {
        await roleRequest.delete({ ids: [role.id] });
        notify.success(t('roles.messages.deleted'));
        await fetchRoles();
      },
    });
  };

  const totalPages = Math.ceil((data?.total ?? 0) / query.pageSize);

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('roles.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('roles.subtitle')}</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          {t('roles.create_btn')}
        </Button>
      </div>

      <Card className="glass border-glass-border">
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <Input className="pl-9" placeholder={t('roles.search_placeholder')} {...register('keyword')} />
              </div>
              <Button type="submit" variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </form>
            <span className="text-sm text-muted-foreground">{t('roles.total_count', { count: data?.total ?? 0 })}</span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('roles.loading')}</div>
          ) : (
            <RolesTable
              roles={data?.roles ?? []}
              skip={(query.page - 1) * query.pageSize}
              onView={handleView}
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

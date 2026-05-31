'use client';

import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { OrderTable, type OrderTableColumn } from '@/components/common/order-table/OrderTable';
import { ProjectCategoryForm } from '@/components/project/project-category-form/ProjectCategoryForm';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { TablePagination } from '@/components/common/table-pagination/TablePagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination.constant';
import { Language } from '@/enums/language.enum';
import { projectCategoryRequest } from '@/requests/project-category.request';
import {
  CreateProjectCategoryBody,
  ListProjectCategoriesResponse,
  ProjectCategoryItem,
  UpdateProjectCategoryBody,
} from '@/types/requests/project-category.type';
import { parseNumber, parseString, useQuery } from '@/utils/use-query.util';
import { generateKeyBetween } from 'fractional-indexing';
import { ArrowUpDown, Check, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const queryTypes = {
  keyword: parseString(),
  locale: parseString(),
  page: parseNumber(1),
  pageSize: parseNumber(DEFAULT_PAGE_SIZE),
};

export default function ProjectCategoriesPage() {
  const t = useTranslations();
  const modal = useAppModal();

  const [catData, setCatData] = useState<ListProjectCategoriesResponse>();
  const [loading, setLoading] = useState(false);
  const [isSortMode, setIsSortMode] = useState(false);

  const [query, setQuery] = useQuery(queryTypes);

  const { register, handleSubmit, control } = useForm({
    defaultValues: { keyword: query.keyword ?? '', locale: query.locale ?? '' },
  });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { page, pageSize, ...rest } = query;
      const res = await projectCategoryRequest.list({
        skip: isSortMode ? 0 : (page - 1) * pageSize,
        take: isSortMode ? 9999 : pageSize,
        ...rest,
      });
      setCatData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [query, isSortMode]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSearchSubmit = handleSubmit(({ keyword, locale }) => {
    const newKeyword = keyword.trim() || undefined;
    const newLocale = locale || undefined;
    if (newKeyword === query.keyword && newLocale === query.locale) return;
    setQuery((prev) => ({ ...prev, keyword: newKeyword, locale: newLocale, page: 1 }));
  });

  const openCreateModal = () => {
    const firstItem = catData?.projectCategories.at(0);
    const nextOrder = generateKeyBetween(null, firstItem?.order ?? null);
    const formDataRef = { current: { name: '', slug: '', order: nextOrder } as Partial<CreateProjectCategoryBody> };
    modal.show({
      title: t('projects.categories.modal.create_title'),
      children: (
        <ProjectCategoryForm
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.name) {
          notify.error(t('projects.categories.validation.name_required'));
          throw new Error('validation');
        }
        if (!formDataRef.current.slug) {
          notify.error(t('projects.categories.validation.slug_required'));
          throw new Error('validation');
        }
        await projectCategoryRequest.create(formDataRef.current as CreateProjectCategoryBody);
        notify.success(t('projects.categories.messages.created'));
        setQuery((prev) => ({ ...prev, page: 1 }));
      },
    });
  };

  const handleEdit = (category: ProjectCategoryItem) => {
    const data: UpdateProjectCategoryBody = {
      name: category.name,
      slug: category.slug,
      locale: category.locale,
      order: category.order,
    };
    const formDataRef = { current: data };
    modal.show({
      title: t('projects.categories.modal.edit_title'),
      children: (
        <ProjectCategoryForm
          initialValue={{ name: category.name, slug: category.slug, locale: category.locale }}
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.name) {
          notify.error(t('projects.categories.validation.name_required'));
          throw new Error('validation');
        }
        await projectCategoryRequest.update(category.id, formDataRef.current);
        notify.success(t('projects.categories.messages.updated'));
        await fetchCategories();
      },
    });
  };

  const handleDelete = (category: ProjectCategoryItem) => {
    modal.show({
      title: t('projects.categories.modal.delete_title'),
      children: (
        <p className="text-sm text-muted-foreground">
          {t('projects.categories.modal.delete_confirm', { name: category.name })}
        </p>
      ),
      okText: t('projects.categories.modal.delete_ok'),
      onOk: async () => {
        await projectCategoryRequest.delete({ ids: [category.id] });
        notify.success(t('projects.categories.messages.deleted'));
        await fetchCategories();
      },
    });
  };

  const handleOrderChange = useCallback(
    async (movedId: number, newOrder: string) => {
      await projectCategoryRequest.update(movedId, { order: newOrder });
      notify.success(t('projects.categories.messages.reordered'));
    },
    [t],
  );

  const skip = isSortMode ? 0 : (query.page - 1) * query.pageSize;

  const columns = useMemo<OrderTableColumn<ProjectCategoryItem>[]>(
    () => [
      {
        key: 'name',
        header: t('projects.categories.table.name'),
        render: (cat) => <span className="font-medium">{cat.name}</span>,
      },
      {
        key: 'slug',
        header: t('projects.categories.table.slug'),
        render: (cat) => <span className="text-muted-foreground text-sm font-mono">{cat.slug}</span>,
      },
    ],
    [t],
  );

  const totalPages = Math.ceil((catData?.total ?? 0) / query.pageSize);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('projects.categories.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('projects.categories.subtitle')}</p>
      </div>

      <Card className="glass border-glass-border">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="relative w-56">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  <Input
                    className="pl-9"
                    placeholder={t('projects.categories.search_placeholder')}
                    {...register('keyword')}
                  />
                </div>
                <Controller
                  control={control}
                  name="locale"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-40 h-9" onClear={field.value ? () => field.onChange('') : undefined}>
                        <SelectValue placeholder={t('common.locale_filter_all')} />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Language).map((lang) => (
                          <SelectItem key={lang} value={lang}>
                            {t(`common.locale_${lang}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                <Button type="submit" variant="outline" size="sm">
                  <Search className="w-4 h-4" />
                </Button>
              </form>
              <span className="text-sm text-muted-foreground">
                {t('projects.categories.total_count', { count: catData?.total ?? 0 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={isSortMode ? 'default' : 'outline'} size="sm" onClick={() => setIsSortMode((v) => !v)}>
                {isSortMode ? <Check className="w-4 h-4 mr-2" /> : <ArrowUpDown className="w-4 h-4 mr-2" />}
                {isSortMode ? t('common.done') : t('common.reorder')}
              </Button>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                {t('projects.categories.create_btn')}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('projects.categories.loading')}</div>
          ) : (
            <OrderTable
              data={catData?.projectCategories ?? []}
              columns={columns}
              skip={skip}
              sortable={isSortMode}
              onOrderChange={handleOrderChange}
              emptyText={t('projects.categories.table.empty')}
              actionsHeader={t('projects.categories.table.actions')}
              actions={(cat) => (
                <>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(cat)} title={t('common.edit')}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(cat)} title={t('common.delete')}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </>
              )}
            />
          )}

          {!isSortMode && (
            <TablePagination
              page={query.page}
              pageSize={query.pageSize}
              totalPages={totalPages}
              onPageChange={(n) => setQuery((prev) => ({ ...prev, page: n }))}
              onPageSizeChange={(size) => setQuery((prev) => ({ ...prev, pageSize: size, page: 1 }))}
            />
          )}
        </div>
      </Card>
    </div>
  );
}

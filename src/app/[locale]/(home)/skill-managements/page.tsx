'use client';

import { IconRenderer } from '@/components/common/icon-renderer/IconRenderer';
import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { OrderTable, type OrderTableColumn } from '@/components/common/order-table/OrderTable';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { SkillCategoryForm } from '@/components/skill/skill-category-form/SkillCategoryForm';
import { TablePagination } from '@/components/common/table-pagination/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination.constant';
import { Language } from '@/enums/language.enum';
import { useRouter } from '@/i18n/navigation';
import { skillCategoryRequest } from '@/requests/skill-category.request';
import {
  CreateSkillCategoryBody,
  ListSkillCategoriesResponse,
  SkillCategoryItem,
} from '@/types/requests/skill-category.type';
import { parseNumber, parseString, useQuery } from '@/utils/use-query.util';
import { generateKeyBetween } from 'fractional-indexing';
import { ArrowUpDown, Check, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const queryTypes = {
  keyword: parseString(),
  locale: parseString(),
  page: parseNumber(1),
  pageSize: parseNumber(DEFAULT_PAGE_SIZE),
};

export default function SkillManagementsPage() {
  const t = useTranslations();
  const modal = useAppModal();
  const router = useRouter();

  const [catData, setCatData] = useState<ListSkillCategoriesResponse>();
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
      const res = await skillCategoryRequest.list({
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

  const handleView = (category: SkillCategoryItem) => {
    router.push(`/skill-managements/${category.id}`);
  };

  const openCreateModal = () => {
    const firstItem = catData?.skillCategories.at(0);
    const nextOrder = generateKeyBetween(null, firstItem?.order ?? null);
    const formDataRef = { current: { name: '', icon: null, order: nextOrder } as Partial<CreateSkillCategoryBody> };
    modal.show({
      title: t('skills.categories.modal.create_title'),
      children: (
        <SkillCategoryForm
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.name) {
          notify.error(t('skills.categories.validation.name_required'));
          throw new Error('validation');
        }
        await skillCategoryRequest.create(formDataRef.current as CreateSkillCategoryBody);
        notify.success(t('skills.categories.messages.created'));
        setQuery((prev) => ({ ...prev, page: 1 }));
      },
    });
  };

  const handleDelete = (category: SkillCategoryItem) => {
    modal.show({
      title: t('skills.categories.modal.delete_title'),
      children: (
        <p className="text-sm text-muted-foreground">
          {t('skills.categories.modal.delete_confirm', { name: category.name })}
        </p>
      ),
      okText: t('skills.categories.modal.delete_ok'),
      onOk: async () => {
        await skillCategoryRequest.delete({ ids: [category.id] });
        notify.success(t('skills.categories.messages.deleted'));
        await fetchCategories();
      },
    });
  };

  const handleOrderChange = useCallback(
    async (movedId: number, newOrder: string) => {
      await skillCategoryRequest.update(movedId, { order: newOrder });
      notify.success(t('skills.categories.messages.reordered'));
    },
    [t],
  );

  const skip = isSortMode ? 0 : (query.page - 1) * query.pageSize;

  const columns = useMemo<OrderTableColumn<SkillCategoryItem>[]>(
    () => [
      {
        key: 'name',
        header: t('skills.categories.table.name'),
        render: (cat) => <span className="font-medium flex items-center gap-1">{cat.name}</span>,
      },
      {
        key: 'icon',
        header: t('skills.categories.table.icon'),
        render: (cat) => (
          <IconRenderer icon={cat.icon} size={18} fallback={<span className="text-muted-foreground text-sm">—</span>} />
        ),
      },
      {
        key: 'skills_count',
        header: t('skills.categories.table.skills_count'),
        render: (cat) => <Badge variant="secondary">{cat.skills?.length ?? 0}</Badge>,
      },
      {
        key: 'locale',
        header: t('skills.categories.table.language'),
        render: (cat) => <Badge variant="outline">{t(`common.locale_${cat.locale}`)}</Badge>,
      },
    ],
    [t],
  );

  const totalPages = Math.ceil((catData?.total ?? 0) / query.pageSize);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('skills.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('skills.subtitle')}</p>
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
                    placeholder={t('skills.categories.search_placeholder')}
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
                {t('skills.categories.total_count', { count: catData?.total ?? 0 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={isSortMode ? 'default' : 'outline'} size="sm" onClick={() => setIsSortMode((v) => !v)}>
                {isSortMode ? <Check className="w-4 h-4 mr-2" /> : <ArrowUpDown className="w-4 h-4 mr-2" />}
                {isSortMode ? t('common.done') : t('common.reorder')}
              </Button>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                {t('skills.categories.create_btn')}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('skills.categories.loading')}</div>
          ) : (
            <OrderTable
              data={catData?.skillCategories ?? []}
              columns={columns}
              skip={skip}
              sortable={isSortMode}
              onRowClick={handleView}
              onOrderChange={handleOrderChange}
              emptyText={t('skills.categories.table.empty')}
              actionsHeader={t('skills.categories.table.actions')}
              actions={(cat) => (
                <>
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

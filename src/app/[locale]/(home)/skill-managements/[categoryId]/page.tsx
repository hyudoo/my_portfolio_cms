'use client';

import { IconRenderer } from '@/components/common/icon-renderer/IconRenderer';
import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { OrderTable, type OrderTableColumn } from '@/components/common/order-table/OrderTable';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { SkillCategoryForm } from '@/components/skill/skill-category-form/SkillCategoryForm';
import { SkillForm } from '@/components/skill/skill-form/SkillForm';
import { TablePagination } from '@/components/common/table-pagination/TablePagination';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination.constant';
import { Language } from '@/enums/language.enum';
import { Link } from '@/i18n/navigation';
import { skillCategoryRequest } from '@/requests/skill-category.request';
import { skillRequest } from '@/requests/skill.request';
import { SkillCategoryDetail, UpdateSkillCategoryBody } from '@/types/requests/skill-category.type';
import { CreateSkillBody, ListSkillsResponse, SkillItem, UpdateSkillBody } from '@/types/requests/skill.type';
import { parseNumber, parseString, useQuery } from '@/utils/use-query.util';
import { generateKeyBetween } from 'fractional-indexing';
import { ArrowLeft, ArrowUpDown, Check, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const queryTypes = {
  keyword: parseString(),
  locale: parseString(),
  page: parseNumber(1),
  pageSize: parseNumber(DEFAULT_PAGE_SIZE),
};

export default function SkillCategoryDetailPage() {
  const t = useTranslations();
  const modal = useAppModal();
  const params = useParams();

  const [category, setCategory] = useState<SkillCategoryDetail | null>(null);
  const [skillData, setSkillData] = useState<ListSkillsResponse>();
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [isSortMode, setIsSortMode] = useState(false);

  const [query, setQuery] = useQuery(queryTypes);

  const { register, handleSubmit, control } = useForm({
    defaultValues: { keyword: query.keyword ?? '', locale: query.locale ?? '' },
  });

  const categoryId = useMemo(() => Number(params.categoryId), [params.categoryId]);

  const fetchCategory = useCallback(async () => {
    try {
      const res = await skillCategoryRequest.detail(categoryId);
      setCategory(res.skillCategory);
    } catch {}
  }, [categoryId]);

  const fetchSkills = useCallback(async () => {
    setSkillsLoading(true);
    try {
      const { page, pageSize, ...rest } = query;
      const res = await skillRequest.list({
        categoryId,
        skip: isSortMode ? 0 : (page - 1) * pageSize,
        take: isSortMode ? 9999 : pageSize,
        ...rest,
      });
      setSkillData(res);
    } catch {
    } finally {
      setSkillsLoading(false);
    }
  }, [query, categoryId, isSortMode]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleSearchSubmit = handleSubmit(({ keyword, locale }) => {
    const newKeyword = keyword.trim() || undefined;
    const newLocale = locale || undefined;
    if (newKeyword === query.keyword && newLocale === query.locale) return;
    setQuery((prev) => ({ ...prev, keyword: newKeyword, locale: newLocale, page: 1 }));
  });

  const openCreateModal = () => {
    const firstItem = skillData?.skills.at(0);
    const nextOrder = generateKeyBetween(null, firstItem?.order ?? null);
    const formDataRef = { current: { name: '', icon: null, order: nextOrder, categoryId } as Partial<CreateSkillBody> };
    modal.show({
      title: t('skills.skills_list.modal.create_title'),
      children: (
        <SkillForm
          initialValue={{ categoryId }}
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.name) {
          notify.error(t('skills.skills_list.validation.name_required'));
          throw new Error('validation');
        }
        await skillRequest.create(formDataRef.current as CreateSkillBody);
        notify.success(t('skills.skills_list.messages.created'));
        setQuery((prev) => ({ ...prev, page: 1 }));
      },
    });
  };

  const handleEdit = (skill: SkillItem) => {
    const data: UpdateSkillBody = {
      name: skill.name,
      icon: skill.icon,
      locale: skill.locale,
      order: skill.order,
      categoryId: skill.categoryId,
    };
    const formDataRef = { current: data };
    modal.show({
      title: t('skills.skills_list.modal.edit_title'),
      children: (
        <SkillForm
          initialValue={{
            name: skill.name,
            icon: skill.icon,
            locale: skill.locale,
            order: skill.order,
            categoryId: skill.categoryId,
          }}
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.name) {
          notify.error(t('skills.skills_list.validation.name_required'));
          throw new Error('validation');
        }
        await skillRequest.update(skill.id, formDataRef.current);
        notify.success(t('skills.skills_list.messages.updated'));
        await fetchSkills();
      },
    });
  };

  const handleDelete = (skill: SkillItem) => {
    modal.show({
      title: t('skills.skills_list.modal.delete_title'),
      children: (
        <p className="text-sm text-muted-foreground">
          {t('skills.skills_list.modal.delete_confirm', { name: skill.name })}
        </p>
      ),
      okText: t('skills.skills_list.modal.delete_ok'),
      onOk: async () => {
        await skillRequest.delete({ ids: [skill.id] });
        notify.success(t('skills.skills_list.messages.deleted'));
        await fetchSkills();
      },
    });
  };

  const handleEditCategory = () => {
    if (!category) return;
    const formDataRef = {
      current: { name: category.name, icon: category.icon, order: category.order } as Partial<UpdateSkillCategoryBody>,
    };
    modal.show({
      title: t('skills.categories.modal.edit_title'),
      children: (
        <SkillCategoryForm
          initialValue={{ name: category.name, icon: category.icon, order: category.order }}
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
        await skillCategoryRequest.update(categoryId, formDataRef.current);
        notify.success(t('skills.categories.messages.updated'));
        await fetchCategory();
      },
    });
  };

  const handleOrderChange = useCallback(
    async (movedId: number, newOrder: string) => {
      await skillRequest.update(movedId, { order: newOrder });
      notify.success(t('skills.skills_list.messages.reordered'));
    },
    [t],
  );

  const skip = isSortMode ? 0 : (query.page - 1) * query.pageSize;

  const columns = useMemo<OrderTableColumn<SkillItem>[]>(
    () => [
      {
        key: 'name',
        header: t('skills.skills_list.table.name'),
        render: (skill) => <span className="font-medium">{skill.name}</span>,
      },
      {
        key: 'icon',
        header: t('skills.skills_list.table.icon'),
        render: (skill) => (
          <IconRenderer
            icon={skill.icon}
            size={18}
            fallback={<span className="text-muted-foreground text-sm">—</span>}
          />
        ),
      },
    ],
    [t],
  );

  const totalPages = Math.ceil((skillData?.total ?? 0) / query.pageSize);

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-1">
        <Link
          href="/skill-managements"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          {t('skills.detail.back')}
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            {category?.icon && <IconRenderer icon={category.icon} size={24} />}
            {category ? category.name : '...'}
          </h1>
          {category && (
            <Button variant="ghost" size="icon" onClick={handleEditCategory} title={t('common.edit')}>
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-muted-foreground text-sm">{t('skills.detail.subtitle')}</p>
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
                    placeholder={t('skills.skills_list.search_placeholder')}
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
                {t('skills.skills_list.total_count', { count: skillData?.total ?? 0 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={isSortMode ? 'default' : 'outline'} size="sm" onClick={() => setIsSortMode((v) => !v)}>
                {isSortMode ? <Check className="w-4 h-4 mr-2" /> : <ArrowUpDown className="w-4 h-4 mr-2" />}
                {isSortMode ? t('common.done') : t('common.reorder')}
              </Button>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                {t('skills.skills_list.create_btn')}
              </Button>
            </div>
          </div>

          {skillsLoading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('skills.skills_list.loading')}</div>
          ) : (
            <OrderTable
              data={skillData?.skills ?? []}
              columns={columns}
              skip={skip}
              sortable={isSortMode}
              onOrderChange={handleOrderChange}
              emptyText={t('skills.skills_list.table.empty')}
              actionsHeader={t('skills.skills_list.table.actions')}
              actions={(skill) => (
                <>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(skill)} title={t('common.edit')}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(skill)} title={t('common.delete')}>
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

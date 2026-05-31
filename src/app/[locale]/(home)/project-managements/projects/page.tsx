'use client';

import { useAppModal } from '@/components/layouts/app-layout/modal-provider/ModalProvider';
import { OrderTable, type OrderTableColumn } from '@/components/common/order-table/OrderTable';
import { ProjectForm } from '@/components/project/project-form/ProjectForm';
import { notify } from '@/components/layouts/app-layout/notify-provider/NotifyProvider';
import { TablePagination } from '@/components/common/table-pagination/TablePagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DEFAULT_PAGE_SIZE } from '@/constants/pagination.constant';
import { Language } from '@/enums/language.enum';
import { projectRequest } from '@/requests/project.request';
import { CreateProjectBody, ListProjectsResponse, ProjectItem, UpdateProjectBody } from '@/types/requests/project.type';
import { parseNumber, parseString, useQuery } from '@/utils/use-query.util';
import { generateKeyBetween } from 'fractional-indexing';
import { ArrowUpDown, Check, ExternalLink, Github, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

const queryTypes = {
  keyword: parseString(),
  locale: parseString(),
  page: parseNumber(1),
  pageSize: parseNumber(DEFAULT_PAGE_SIZE),
};

export default function ProjectsPage() {
  const t = useTranslations();
  const modal = useAppModal();

  const [projData, setProjData] = useState<ListProjectsResponse>();
  const [loading, setLoading] = useState(false);
  const [isSortMode, setIsSortMode] = useState(false);

  const [query, setQuery] = useQuery(queryTypes);

  const { register, handleSubmit, control } = useForm({
    defaultValues: { keyword: query.keyword ?? '', locale: query.locale ?? '' },
  });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const { page, pageSize, ...rest } = query;
      const res = await projectRequest.list({
        skip: isSortMode ? 0 : (page - 1) * pageSize,
        take: isSortMode ? 9999 : pageSize,
        ...rest,
      });
      setProjData(res);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [query, isSortMode]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleSearchSubmit = handleSubmit(({ keyword, locale }) => {
    const newKeyword = keyword.trim() || undefined;
    const newLocale = locale || undefined;
    if (newKeyword === query.keyword && newLocale === query.locale) return;
    setQuery((prev) => ({ ...prev, keyword: newKeyword, locale: newLocale, page: 1 }));
  });

  const openCreateModal = () => {
    const firstItem = projData?.projects.at(0);
    const nextOrder = generateKeyBetween(null, firstItem?.order ?? null);
    const formDataRef = {
      current: {
        title: '',
        description: '',
        liveUrl: null,
        githubUrl: null,
        featured: false,
        order: nextOrder,
        skillIds: [],
        categoryIds: [],
      } as Partial<CreateProjectBody>,
    };
    modal.show({
      title: t('projects.projects_list.modal.create_title'),
      children: (
        <ProjectForm
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.title) {
          notify.error(t('projects.projects_list.validation.title_required'));
          throw new Error('validation');
        }
        if (!formDataRef.current.description) {
          notify.error(t('projects.projects_list.validation.description_required'));
          throw new Error('validation');
        }
        await projectRequest.create(formDataRef.current as CreateProjectBody);
        notify.success(t('projects.projects_list.messages.created'));
        setQuery((prev) => ({ ...prev, page: 1 }));
      },
    });
  };

  const handleEdit = (project: ProjectItem) => {
    const data: UpdateProjectBody = {
      title: project.title,
      description: project.description,
      liveUrl: project.liveUrl,
      githubUrl: project.githubUrl,
      featured: project.featured,
      locale: project.locale,
      order: project.order,
      skillIds: project.skills?.map((s) => s.id) ?? [],
      categoryIds: project.categories?.map((c) => c.id) ?? [],
    };
    const formDataRef = { current: data };
    modal.show({
      title: t('projects.projects_list.modal.edit_title'),
      children: (
        <ProjectForm
          initialValue={data}
          onChange={(v) => {
            formDataRef.current = { ...formDataRef.current, ...v };
          }}
        />
      ),
      onOk: async () => {
        if (!formDataRef.current.title) {
          notify.error(t('projects.projects_list.validation.title_required'));
          throw new Error('validation');
        }
        await projectRequest.update(project.id, formDataRef.current);
        notify.success(t('projects.projects_list.messages.updated'));
        await fetchProjects();
      },
    });
  };

  const handleDelete = (project: ProjectItem) => {
    modal.show({
      title: t('projects.projects_list.modal.delete_title'),
      children: (
        <p className="text-sm text-muted-foreground">
          {t('projects.projects_list.modal.delete_confirm', { title: project.title })}
        </p>
      ),
      okText: t('projects.projects_list.modal.delete_ok'),
      onOk: async () => {
        await projectRequest.delete({ ids: [project.id] });
        notify.success(t('projects.projects_list.messages.deleted'));
        await fetchProjects();
      },
    });
  };

  const handleOrderChange = useCallback(
    async (movedId: number, newOrder: string) => {
      await projectRequest.update(movedId, { order: newOrder });
      notify.success(t('projects.projects_list.messages.reordered'));
    },
    [t],
  );

  const skip = isSortMode ? 0 : (query.page - 1) * query.pageSize;

  const columns = useMemo<OrderTableColumn<ProjectItem>[]>(
    () => [
      {
        key: 'title',
        header: t('projects.projects_list.table.title'),
        render: (project) => (
          <div>
            <p className="font-medium">{project.title}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>
          </div>
        ),
      },
      {
        key: 'categories',
        header: t('projects.projects_list.table.categories'),
        render: (project) => (
          <div className="flex flex-wrap gap-1">
            {project.categories?.length ? (
              project.categories.map((c) => (
                <Badge key={c.id} variant="outline" className="text-xs">
                  {c.name}
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground text-sm">—</span>
            )}
          </div>
        ),
      },
      {
        key: 'featured',
        header: t('projects.projects_list.table.featured'),
        render: (project) =>
          project.featured ? <Badge variant="secondary">{t('projects.projects_list.table.featured_yes')}</Badge> : null,
      },
      {
        key: 'links',
        header: t('projects.projects_list.table.links'),
        render: (project) => (
          <div className="flex items-center gap-1">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title={t('projects.projects_list.table.live_link')}
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  title={t('projects.projects_list.table.github_link')}
                >
                  <Github className="w-3.5 h-3.5" />
                </Button>
              </a>
            )}
          </div>
        ),
      },
    ],
    [t],
  );

  const totalPages = Math.ceil((projData?.total ?? 0) / query.pageSize);

  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('projects.title')}</h1>
        <p className="text-muted-foreground text-sm mt-1">{t('projects.subtitle')}</p>
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
                    placeholder={t('projects.projects_list.search_placeholder')}
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
                {t('projects.projects_list.total_count', { count: projData?.total ?? 0 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant={isSortMode ? 'default' : 'outline'} size="sm" onClick={() => setIsSortMode((v) => !v)}>
                {isSortMode ? <Check className="w-4 h-4 mr-2" /> : <ArrowUpDown className="w-4 h-4 mr-2" />}
                {isSortMode ? t('common.done') : t('common.reorder')}
              </Button>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                {t('projects.projects_list.create_btn')}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-muted-foreground text-sm">{t('projects.projects_list.loading')}</div>
          ) : (
            <OrderTable
              data={projData?.projects ?? []}
              columns={columns}
              skip={skip}
              sortable={isSortMode}
              onOrderChange={handleOrderChange}
              emptyText={t('projects.projects_list.table.empty')}
              actionsHeader={t('projects.projects_list.table.actions')}
              actions={(project) => (
                <>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(project)} title={t('common.edit')}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project)} title={t('common.delete')}>
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

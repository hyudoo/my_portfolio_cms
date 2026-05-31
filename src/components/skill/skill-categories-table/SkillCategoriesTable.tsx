'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IconRenderer } from '@/components/common/icon-renderer/IconRenderer';
import { SkillCategoryItem } from '@/types/requests/skill-category.type';
import { useTranslations } from 'next-intl';
import { ChevronRight, Pencil, Trash2 } from 'lucide-react';

type SkillCategoriesTableProps = {
  categories: SkillCategoryItem[];
  skip: number;
  onView: (category: SkillCategoryItem) => void;
  onEdit: (category: SkillCategoryItem) => void;
  onDelete: (category: SkillCategoryItem) => void;
};

export const SkillCategoriesTable: React.FC<SkillCategoriesTableProps> = ({
  categories,
  skip,
  onView,
  onEdit,
  onDelete,
}) => {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t('skills.categories.table.name')}</TableHead>
          <TableHead>{t('skills.categories.table.icon')}</TableHead>
          <TableHead>{t('skills.categories.table.order')}</TableHead>
          <TableHead>{t('skills.categories.table.skills_count')}</TableHead>
          <TableHead className="text-right">{t('skills.categories.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
              {t('skills.categories.table.empty')}
            </TableCell>
          </TableRow>
        )}
        {categories.map((category, idx) => (
          <TableRow key={category.id} className="cursor-pointer" onClick={() => onView(category)}>
            <TableCell className="text-muted-foreground">{skip + idx + 1}</TableCell>
            <TableCell className="font-medium">
              <span className="flex items-center gap-2">
                {category.name}
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
              </span>
            </TableCell>
            <TableCell>
              <IconRenderer
                icon={category.icon}
                size={18}
                fallback={<span className="text-muted-foreground text-sm">—</span>}
              />
            </TableCell>
            <TableCell>{category.order}</TableCell>
            <TableCell>
              <Badge variant="secondary">{category.skills?.length ?? 0}</Badge>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="icon" onClick={() => onEdit(category)} title={t('common.edit')}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(category)} title={t('common.delete')}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

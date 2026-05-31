'use client';

import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProjectCategoryItem } from '@/types/requests/project-category.type';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';

type ProjectCategoriesTableProps = {
  categories: ProjectCategoryItem[];
  skip: number;
  onEdit: (category: ProjectCategoryItem) => void;
  onDelete: (category: ProjectCategoryItem) => void;
};

export const ProjectCategoriesTable: React.FC<ProjectCategoriesTableProps> = ({ categories, skip, onEdit, onDelete }) => {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t('projects.categories.table.name')}</TableHead>
          <TableHead>{t('projects.categories.table.slug')}</TableHead>
          <TableHead>{t('projects.categories.table.order')}</TableHead>
          <TableHead className="text-right">{t('projects.categories.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
              {t('projects.categories.table.empty')}
            </TableCell>
          </TableRow>
        )}
        {categories.map((category, idx) => (
          <TableRow
            key={category.id}
            className="cursor-pointer"
            onClick={() => onEdit(category)}
          >
            <TableCell className="text-muted-foreground">{skip + idx + 1}</TableCell>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell className="text-muted-foreground text-sm font-mono">{category.slug}</TableCell>
            <TableCell>{category.order}</TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1 justify-end">
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

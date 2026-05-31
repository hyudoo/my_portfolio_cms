'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { IconRenderer } from '@/components/common/icon-renderer/IconRenderer';
import { SkillItem } from '@/types/requests/skill.type';
import { useTranslations } from 'next-intl';
import { Trash2 } from 'lucide-react';

type SkillsTableProps = {
  skills: SkillItem[];
  skip: number;
  hideCategory?: boolean;
  onEdit: (skill: SkillItem) => void;
  onDelete: (skill: SkillItem) => void;
};

export const SkillsTable: React.FC<SkillsTableProps> = ({ skills, skip, hideCategory, onEdit, onDelete }) => {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t('skills.skills_list.table.name')}</TableHead>
          <TableHead>{t('skills.skills_list.table.icon')}</TableHead>
          <TableHead>{t('skills.skills_list.table.order')}</TableHead>
          {!hideCategory && <TableHead>{t('skills.skills_list.table.category')}</TableHead>}
          <TableHead className="text-right">{t('skills.skills_list.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {skills.length === 0 && (
          <TableRow>
            <TableCell colSpan={hideCategory ? 5 : 6} className="text-center text-muted-foreground py-12">
              {t('skills.skills_list.table.empty')}
            </TableCell>
          </TableRow>
        )}
        {skills.map((skill, idx) => (
          <TableRow key={skill.id} className="cursor-pointer" onClick={() => onEdit(skill)}>
            <TableCell className="text-muted-foreground">{skip + idx + 1}</TableCell>
            <TableCell className="font-medium">{skill.name}</TableCell>
            <TableCell>
              <IconRenderer
                icon={skill.icon}
                size={18}
                fallback={<span className="text-muted-foreground text-sm">—</span>}
              />
            </TableCell>
            <TableCell>{skill.order}</TableCell>
            {!hideCategory && (
              <TableCell>
                {skill.category ? (
                  <Badge variant="outline">{skill.category.name}</Badge>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
            )}
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="icon" onClick={() => onDelete(skill)} title={t('common.delete')}>
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

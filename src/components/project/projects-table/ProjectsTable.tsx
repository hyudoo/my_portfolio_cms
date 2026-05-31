'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ProjectItem } from '@/types/requests/project.type';
import { useTranslations } from 'next-intl';
import { Trash2, ExternalLink, Github } from 'lucide-react';

type ProjectsTableProps = {
  projects: ProjectItem[];
  skip: number;
  onEdit: (project: ProjectItem) => void;
  onDelete: (project: ProjectItem) => void;
};

export const ProjectsTable: React.FC<ProjectsTableProps> = ({ projects, skip, onEdit, onDelete }) => {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t('projects.projects_list.table.title')}</TableHead>
          <TableHead>{t('projects.projects_list.table.categories')}</TableHead>
          <TableHead>{t('projects.projects_list.table.skills')}</TableHead>
          <TableHead>{t('projects.projects_list.table.featured')}</TableHead>
          <TableHead>{t('projects.projects_list.table.order')}</TableHead>
          <TableHead>{t('projects.projects_list.table.links')}</TableHead>
          <TableHead className="text-right">{t('projects.projects_list.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.length === 0 && (
          <TableRow>
            <TableCell colSpan={8} className="text-center text-muted-foreground py-12">
              {t('projects.projects_list.table.empty')}
            </TableCell>
          </TableRow>
        )}
        {projects.map((project, idx) => (
          <TableRow
            key={project.id}
            className="cursor-pointer"
            onClick={() => onEdit(project)}
          >
            <TableCell className="text-muted-foreground">{skip + idx + 1}</TableCell>
            <TableCell>
              <div className="max-w-48">
                <p className="font-medium truncate">{project.title}</p>
                <p className="text-xs text-muted-foreground truncate mt-0.5">{project.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {project.categories?.map((cat) => (
                  <Badge key={cat.id} variant="outline" className="text-xs">{cat.name}</Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="secondary">{project.skills?.length ?? 0}</Badge>
            </TableCell>
            <TableCell>
              {project.featured ? (
                <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 hover:bg-amber-500/20">
                  {t('projects.projects_list.table.featured_yes')}
                </Badge>
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </TableCell>
            <TableCell>{project.order}</TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1">
                {project.liveUrl && (
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" title={t('projects.projects_list.table.live_link')}>
                      <ExternalLink className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </a>
                )}
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="ghost" size="icon" title={t('projects.projects_list.table.github_link')}>
                      <Github className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </a>
                )}
              </div>
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="icon" onClick={() => onDelete(project)} title={t('common.delete')}>
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

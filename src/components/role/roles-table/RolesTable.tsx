'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RoleItem } from '@/types/requests/role.type';
import { ShieldCheck, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type RolesTableProps = {
  roles: RoleItem[];
  skip: number;
  onView: (role: RoleItem) => void;
  onDelete: (role: RoleItem) => void;
};

export const RolesTable: React.FC<RolesTableProps> = ({ roles, skip, onView, onDelete }) => {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t('roles.table.name')}</TableHead>
          <TableHead>{t('roles.table.default')}</TableHead>
          <TableHead>{t('roles.table.permissions_count')}</TableHead>
          <TableHead>{t('roles.table.created_at')}</TableHead>
          <TableHead className="text-right">{t('roles.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {roles.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
              {t('roles.table.empty')}
            </TableCell>
          </TableRow>
        )}
        {roles.map((role, idx) => (
          <TableRow key={role.id} className="cursor-pointer" onClick={() => onView(role)}>
            <TableCell className="text-muted-foreground">{skip + idx + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{role.name}</span>
              </div>
            </TableCell>
            <TableCell>
              {role.isDefault && (
                <Badge className="bg-sky-500/20 text-sky-600 border-sky-500/30 hover:bg-sky-500/20">
                  {t('roles.table.default_badge')}
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {role.permissions?.length ?? 0}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(role.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(role)}
                  title={t('common.delete')}
                  disabled={role.isDefault}
                >
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

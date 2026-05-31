'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { cn } from '@/lib/utils';
import { UserItem } from '@/types/requests/user.type';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

type UsersTableProps = {
  users: UserItem[];
  skip: number;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
  onRestore: (user: UserItem) => void;
};

export const UsersTable: React.FC<UsersTableProps> = ({ users, skip, onEdit, onDelete, onRestore }) => {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t('users.table.username')}</TableHead>
          <TableHead>{t('users.table.email')}</TableHead>
          <TableHead>{t('users.table.status')}</TableHead>
          <TableHead>{t('users.table.roles')}</TableHead>
          <TableHead>{t('users.table.created_at')}</TableHead>
          <TableHead className="text-right">{t('users.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center text-muted-foreground py-12">
              {t('users.table.empty')}
            </TableCell>
          </TableRow>
        )}
        {users.map((user, idx) => (
          <TableRow
            key={user.id}
            className={cn(user.deletedAt ? 'opacity-50' : 'cursor-pointer')}
            onClick={() => !user.deletedAt && onEdit(user)}
          >
            <TableCell className="text-muted-foreground">{skip + idx + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user.avatar?.url} />
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{user.username}</span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground">{user.email}</TableCell>
            <TableCell>
              <Badge
                variant={user.isActive ? 'default' : 'secondary'}
                className={user.isActive ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20' : ''}
              >
                {user.isActive ? t('users.status.active') : t('users.status.inactive')}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex gap-1 flex-wrap">
                {user.roles?.map((role) => (
                  <Badge key={role.name} variant="outline" className="text-xs">
                    {role.name}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(user.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1 justify-end">
                {user.deletedAt ? (
                  <Button variant="ghost" size="icon" onClick={() => onRestore(user)} title={t('common.restore')}>
                    <RotateCcw className="w-4 h-4 text-emerald-500" />
                  </Button>
                ) : (
                  <Button variant="ghost" size="icon" onClick={() => onDelete(user)} title={t('common.delete')}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

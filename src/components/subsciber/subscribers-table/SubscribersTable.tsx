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
import { cn } from '@/lib/utils';
import { SubscriberItem } from '@/types/requests/subscriber.type';
import { useTranslations } from 'next-intl';
import { Pencil, Trash2 } from 'lucide-react';

type SubscribersTableProps = {
  subscribers: SubscriberItem[];
  skip: number;
  onEdit: (subscriber: SubscriberItem) => void;
  onDelete: (subscriber: SubscriberItem) => void;
};

export const SubscribersTable: React.FC<SubscribersTableProps> = ({ subscribers, skip, onEdit, onDelete }) => {
  const t = useTranslations();

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">#</TableHead>
          <TableHead>{t('subscribers.table.email')}</TableHead>
          <TableHead>{t('subscribers.table.status')}</TableHead>
          <TableHead>{t('subscribers.table.confirmed_at')}</TableHead>
          <TableHead>{t('subscribers.table.created_at')}</TableHead>
          <TableHead className="text-right">{t('subscribers.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {subscribers.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
              {t('subscribers.table.empty')}
            </TableCell>
          </TableRow>
        )}
        {subscribers.map((subscriber, idx) => (
          <TableRow
            key={subscriber.id}
            className={cn('cursor-pointer')}
            onClick={() => onEdit(subscriber)}
          >
            <TableCell className="text-muted-foreground">{skip + idx + 1}</TableCell>
            <TableCell className="font-medium">{subscriber.email}</TableCell>
            <TableCell>
              <Badge
                variant={subscriber.confirmedAt ? 'default' : 'secondary'}
                className={subscriber.confirmedAt ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20' : ''}
              >
                {subscriber.confirmedAt ? t('subscribers.status.confirmed') : t('subscribers.status.pending')}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {subscriber.confirmedAt ? new Date(subscriber.confirmedAt).toLocaleDateString() : '—'}
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(subscriber.createdAt).toLocaleDateString()}
            </TableCell>
            <TableCell onClick={(e) => e.stopPropagation()}>
              <div className="flex gap-1 justify-end">
                <Button variant="ghost" size="icon" onClick={() => onEdit(subscriber)} title={t('common.edit')}>
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(subscriber)} title={t('common.delete')}>
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

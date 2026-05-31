'use client';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { generateKeyBetween } from 'fractional-indexing';
import { GripVertical, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export type OrderTableColumn<T> = {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  className?: string;
};

type OrderTableProps<T extends { id: number; order: string }> = {
  data: T[];
  columns: OrderTableColumn<T>[];
  actions?: (item: T) => React.ReactNode;
  onRowClick?: (item: T) => void;
  onOrderChange: (movedId: number, newOrder: string) => Promise<void>;
  skip?: number;
  emptyText?: string;
  actionsHeader?: string;
  sortable?: boolean;
};

// SortableRow uses `any` for callback props because generics cannot be
// threaded through JSX component calls without triggering TS inference issues.
type SortableRowProps = {
  item: { id: number; order: string };
  index: number;
  skip: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: OrderTableColumn<any>[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  actions?: (item: any) => React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onRowClick?: (item: any) => void;
  isSaving: boolean;
  sortable: boolean;
};

function SortableRow({
  item,
  index,
  skip,
  columns,
  actions,
  onRowClick,
  isSaving,
  sortable,
}: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className={cn(
        onRowClick && 'cursor-pointer',
        isDragging && 'opacity-50 bg-muted/50 relative z-10'
      )}
      onClick={() => onRowClick?.(item)}
    >
      {sortable && (
        <TableCell className="w-8 pr-0">
          <span
            {...attributes}
            {...listeners}
            className={cn(
              'flex text-muted-foreground hover:text-foreground',
              isSaving ? 'cursor-wait' : 'cursor-grab active:cursor-grabbing'
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <GripVertical className="w-4 h-4" />
            )}
          </span>
        </TableCell>
      )}
      <TableCell className="text-muted-foreground">{skip + index + 1}</TableCell>
      {columns.map((col) => (
        <TableCell key={col.key} className={col.className}>
          {col.render(item)}
        </TableCell>
      ))}
      {actions && (
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex gap-1 justify-end">{actions(item)}</div>
        </TableCell>
      )}
    </TableRow>
  );
}

export function OrderTable<T extends { id: number; order: string }>({
  data,
  columns,
  actions,
  onRowClick,
  onOrderChange,
  skip = 0,
  emptyText = 'No data',
  actionsHeader = '',
  sortable = false,
}: OrderTableProps<T>) {
  const [items, setItems] = useState<T[]>(data);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setItems(data);
  }, [data]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!sortable || !over || active.id === over.id || isSaving) return;

    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    const moved = arrayMove(items, oldIndex, newIndex);

    // Skip neighbors whose order values are not valid fractional-indexing keys
    // (e.g. legacy data seeded as "a10", "a20" whose decimal ends in '0')
    let prevOrder: string | null = null;
    for (let i = newIndex - 1; i >= 0; i--) {
      try {
        generateKeyBetween(moved[i].order, null);
        prevOrder = moved[i].order;
        break;
      } catch {
        // invalid key – keep searching
      }
    }

    let nextOrder: string | null = null;
    for (let i = newIndex + 1; i < moved.length; i++) {
      try {
        generateKeyBetween(null, moved[i].order);
        nextOrder = moved[i].order;
        break;
      } catch {
        // invalid key – keep searching
      }
    }

    const newOrder = generateKeyBetween(prevOrder, nextOrder);

    const updated = [...moved];
    updated[newIndex] = { ...updated[newIndex], order: newOrder };
    setItems(updated);

    setIsSaving(true);
    try {
      await onOrderChange(active.id as number, newOrder);
    } finally {
      setIsSaving(false);
    }
  };

  const colSpan = (sortable ? 2 : 1) + columns.length + (actions ? 1 : 0);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Table>
        <TableHeader>
          <TableRow>
            {sortable && <TableHead className="w-8" />}
            <TableHead className="w-12">#</TableHead>
            {columns.map((col) => (
              <TableHead key={col.key} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            {actions && (
              <TableHead className="text-right">{actionsHeader}</TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={colSpan}
                className="text-center text-muted-foreground py-12"
              >
                {emptyText}
              </TableCell>
            </TableRow>
          ) : (
            <SortableContext
              items={items.map((i) => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {items.map((item, idx) => (
                <SortableRow
                  key={item.id}
                  item={item}
                  index={idx}
                  skip={skip}
                  columns={columns}
                  actions={actions}
                  onRowClick={onRowClick}
                  isSaving={isSaving}
                  sortable={sortable}
                />
              ))}
            </SortableContext>
          )}
        </TableBody>
      </Table>
    </DndContext>
  );
}

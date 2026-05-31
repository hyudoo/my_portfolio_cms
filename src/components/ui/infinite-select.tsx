'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export type InfiniteSelectOption = {
  value: string;
  label: string;
};

type CommonProps = {
  options: InfiniteSelectOption[];
  hasMore?: boolean;
  loading?: boolean;
  onLoadMore?: () => void;
  onSearch?: (search: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
};

type SingleProps = CommonProps & {
  multiple?: false;
  value?: string;
  onChange?: (value: string) => void;
};

type MultipleProps = CommonProps & {
  multiple: true;
  value?: string[];
  onChange?: (value: string[]) => void;
};

type InfiniteSelectProps = SingleProps | MultipleProps;

export function InfiniteSelect({
  options,
  hasMore = false,
  loading = false,
  onLoadMore,
  onSearch,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results.',
  className,
  ...modeProps
}: InfiniteSelectProps) {
  const [open, setOpen] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [knownOptions, setKnownOptions] = React.useState<Map<string, string>>(new Map());

  React.useEffect(() => {
    if (options.length === 0) return;
    setKnownOptions((prev) => {
      const next = new Map(prev);
      let changed = false;
      for (const o of options) {
        if (!next.has(o.value) || next.get(o.value) !== o.label) {
          next.set(o.value, o.label);
          changed = true;
        }
      }
      return changed ? next : prev;
    });
  }, [options]);

  const isMultiple = modeProps.multiple === true;
  const multipleValue = isMultiple ? ((modeProps as MultipleProps).value ?? []) : [];
  const singleValue = !isMultiple ? (modeProps as SingleProps).value : undefined;

  const isSelected = (v: string) =>
    isMultiple ? multipleValue.includes(v) : singleValue === v;

  const handleSelect = (v: string) => {
    if (isMultiple) {
      const onChange = (modeProps as MultipleProps).onChange;
      const next = multipleValue.includes(v)
        ? multipleValue.filter((x) => x !== v)
        : [...multipleValue, v];
      onChange?.(next);
    } else {
      const onChange = (modeProps as SingleProps).onChange;
      onChange?.(v === singleValue ? '' : v);
      setOpen(false);
    }
  };

  const handleRemoveTag = (v: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const onChange = (modeProps as MultipleProps).onChange;
    onChange?.(multipleValue.filter((x) => x !== v));
  };

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el || !hasMore || loading) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 50) {
      onLoadMore?.();
    }
  }, [hasMore, loading, onLoadMore]);

  const resolveLabel = (v: string) =>
    options.find((o) => o.value === v)?.label ?? knownOptions.get(v) ?? v;

  const selectedLabels = isMultiple
    ? multipleValue.map((v) => ({ value: v, label: resolveLabel(v) }))
    : [];

  const singleLabel = !isMultiple && singleValue ? resolveLabel(singleValue) : undefined;

  const triggerContent = isMultiple ? (
    selectedLabels.length > 0 ? (
      <div className="flex flex-wrap gap-1">
        {selectedLabels.map((item) => (
          <Badge key={item.value} variant="secondary" className="gap-1 pr-1">
            <span className="truncate max-w-[120px]">{item.label}</span>
            <span
              role="button"
              onClick={(e) => handleRemoveTag(item.value, e)}
              className="rounded-full hover:bg-muted cursor-pointer"
            >
              <X className="h-3 w-3" />
            </span>
          </Badge>
        ))}
      </div>
    ) : (
      <span className="text-muted-foreground">{placeholder}</span>
    )
  ) : (
    <span className={cn('truncate', !singleLabel && 'text-muted-foreground')}>
      {singleLabel ?? placeholder}
    </span>
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            isMultiple && selectedLabels.length > 0 && 'h-auto min-h-9 py-1.5',
            className,
          )}
        >
          {triggerContent}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput placeholder={searchPlaceholder} onValueChange={onSearch} />
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="max-h-[300px] overflow-x-hidden overflow-y-auto scroll-py-1"
          >
            {options.length === 0 && !loading ? (
              <div className="py-6 text-center text-sm">{emptyText}</div>
            ) : (
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4 shrink-0',
                        isSelected(option.value) ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {loading && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

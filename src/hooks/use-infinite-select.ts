import { useCallback, useEffect, useRef, useState } from 'react';
import { InfiniteSelectOption } from '@/components/ui/infinite-select';

type FetchFn = (params: { search: string; skip: number; take: number }) => Promise<{
  items: InfiniteSelectOption[];
  total: number;
}>;

const PAGE_SIZE = 10;

export function useInfiniteSelect(fetchFn: FetchFn) {
  const [options, setOptions] = useState<InfiniteSelectOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');

  const searchRef = useRef(search);
  const skipRef = useRef(0);
  const loadingRef = useRef(false);

  const load = useCallback(
    async (reset: boolean) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      try {
        const skip = reset ? 0 : skipRef.current;
        const { items, total } = await fetchFn({
          search: searchRef.current,
          skip,
          take: PAGE_SIZE,
        });
        setOptions((prev) => (reset ? items : [...prev, ...items]));
        skipRef.current = skip + items.length;
        setHasMore(skip + items.length < total);
      } catch {
      } finally {
        loadingRef.current = false;
        setLoading(false);
      }
    },
    [fetchFn],
  );

  // Reset and reload when search changes
  useEffect(() => {
    searchRef.current = search;
    skipRef.current = 0;
    setHasMore(true);
    load(true);
  }, [search, load]);

  const handleLoadMore = useCallback(() => {
    load(false);
  }, [load]);

  return { options, loading, hasMore, onSearch: setSearch, onLoadMore: handleLoadMore };
}

import { isArray } from 'lodash';
import { ReadonlyURLSearchParams, useSearchParams } from 'next/navigation';
import { DependencyList, useCallback, useMemo, useRef } from 'react';
import { useAppRouter } from './use-app-router';

type DefaultMap = Record<string, any>;

export type UseQueryOptions<T extends DefaultMap> = {
  [F in keyof T]: (searchParams: ReadonlyURLSearchParams, field: string) => T[F];
};

export type UseQueryReturnType<T extends DefaultMap> = [
  T, // query
  (p: T | ((prev: T) => T)) => void, // setQuery
];

export const useQuery = <T extends DefaultMap = DefaultMap>(
  types: UseQueryOptions<T>,
  deps: DependencyList = [],
): UseQueryReturnType<T> => {
  const router = useAppRouter();
  const searchParams = useSearchParams();

  const queryRef = useRef<T | undefined>(undefined);

  const query = useMemo(() => {
    queryRef.current = Object.fromEntries(
      Object.keys(types).map((field) => [field, types[field](searchParams!, field)]),
    ) as T;
    return queryRef.current;
    // eslint-disable-next-line
  }, [searchParams, ...deps]);

  const setQuery = useCallback(
    (p: T | ((prev: T) => T)) => {
      const query = typeof p === 'function' ? p(queryRef.current!) : p;
      const searchParams = new URLSearchParams();
      for (const key in query) {
        if (isArray(query[key])) {
          query[key].forEach((value: string) => searchParams.append(key, String(value)));
        } else if (query[key] != null && query[key] !== '') {
          searchParams.append(key, String(query[key]));
        }
      }
      router.push('?' + searchParams.toString(), { scroll: false });
    },
    [router],
  );

  return [query, setQuery];
};

export function parseNumber(): (searchParams: ReadonlyURLSearchParams, field: string) => number | undefined;
export function parseNumber(d: number): (searchParams: ReadonlyURLSearchParams, field: string) => number;
export function parseNumber(d?: number) {
  return (searchParams: ReadonlyURLSearchParams, field: string) => {
    const p = searchParams.get(field);
    if (!p) return d;
    const ans = Number(p);
    return Number.isNaN(ans) ? d : ans;
  };
}

export function parseString(): (searchParams: ReadonlyURLSearchParams, field: string) => string | undefined;
export function parseString(d: string): (searchParams: ReadonlyURLSearchParams, field: string) => string;
export function parseString(d?: string) {
  return (searchParams: ReadonlyURLSearchParams, field: string) => searchParams.get(field) ?? d;
}

export function parseBoolean(d = false) {
  return (searchParams: ReadonlyURLSearchParams, field: string) => {
    const p = searchParams.get(field);
    if (!p) return d;
    return p === 'true' || p === '1';
  };
}

export function parseNumberArray(): (searchParams: ReadonlyURLSearchParams, field: string) => number[] | undefined;
export function parseNumberArray(d: number[]): (searchParams: ReadonlyURLSearchParams, field: string) => number[];
export function parseNumberArray(d?: number[]) {
  return (searchParams: ReadonlyURLSearchParams, field: string) => {
    const p = searchParams.getAll(field);
    if (!p || p.length === 0) return d;
    return p.map((e) => Number(e)).filter((e) => !Number.isNaN(e));
  };
}

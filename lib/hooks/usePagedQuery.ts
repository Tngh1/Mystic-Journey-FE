import { useState, useCallback, useEffect } from "react";
import apiClient, { normalizeError } from "../api/client";

export interface PagedResponse<T> {
  totalCount: number;
  items: T[];
}

export interface UsePagedQueryOptions {
  endpoint: string;
  pageSize?: number;
  params?: Record<string, string | number | boolean | undefined>;
}

export interface UsePagedQueryReturn<T> {
  data: T[];
  totalCount: number;
  loading: boolean;
  error: string | null;
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setParams: (params: Record<string, string | number | boolean | undefined>) => void;
  refresh: () => void;
}

export function usePagedQuery<T>({
  endpoint,
  pageSize: initialPageSize = 10,
  params: initialParams = {},
}: UsePagedQueryOptions): UsePagedQueryReturn<T> {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [params, setParams] = useState(initialParams);
  const [data, setData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        ...Object.fromEntries(
          Object.entries(params).filter(
            ([, v]) => v !== undefined && v !== null && v !== ""
          )
        ),
      });
      const response = await apiClient.get<PagedResponse<T>>(
        `${endpoint}?${queryParams.toString()}`
      );
      setData(response.data.items ?? []);
      setTotalCount(response.data.totalCount ?? 0);
    } catch (err) {
      setError(normalizeError(err).message);
    } finally {
      setLoading(false);
    }
  }, [endpoint, page, pageSize, params, refreshKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    totalCount,
    loading,
    error,
    page,
    pageSize,
    setPage,
    setPageSize,
    setParams,
    refresh,
  };
}

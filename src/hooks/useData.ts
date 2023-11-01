import { useEffect, useState } from "react";

export function useData<T>(
  api: (params?: any) => Promise<T>,
  manual: boolean = false
): {
  data?: T;
  loading: boolean;
  loadData: (params?: any) => void;
} {
  const [data, setData] = useState<T | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = (params?: any) => {
    setLoading(true);
    api(params).then((res) => {
      setData(res);
    }).catch().finally(() => setLoading(false));
  }

  useEffect(() => {
    if (!manual) loadData();
  }, []);

  return { data, loading, loadData };
}

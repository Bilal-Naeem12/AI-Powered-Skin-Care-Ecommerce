import { useState, useEffect } from "react";
import axios from "axios";
const useFetchData = <T,>(url: string, reloadTrigger?: boolean) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true); setError(null); setData(null);
    axios.get<T>(url, { signal: controller.signal }).then(response => {
      if (!controller.signal.aborted) setData(response.data);
    }).catch(() => {
      if (!controller.signal.aborted) setError("Failed to fetch data.");
    }).finally(() => {
      if (!controller.signal.aborted) setLoading(false);
    });
    return () => controller.abort();
  }, [url, reloadTrigger]);
  return { data, loading, error, reloadTrigger };
};
export default useFetchData;

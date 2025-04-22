import { useState, useEffect } from "react";
import axios from "axios";

const useFetchData = <T,>(url: string, reloadTrigger?: boolean) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get<T>(url);
        console.log("API Response:", response.data); // Log the response data to the console
        setData(response.data);
      } catch (err: any) {
        setError("Failed to fetch data.");
        console.error("Error fetching data:", err); // Log any errors
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, reloadTrigger]); // Reload when reloadTrigger changes

  return { data, loading, error };
};

export default useFetchData;

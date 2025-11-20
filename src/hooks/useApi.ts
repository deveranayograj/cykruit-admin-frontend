/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import { ApiError } from "@/types/auth";

interface UseApiOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: ApiError) => void;
}

export const useApi = <T = any>(options?: UseApiOptions) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const execute = useCallback(
    async (apiCall: () => Promise<T>) => {
      setLoading(true);
      setError(null);

      try {
        const result = await apiCall();
        setData(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err: any) {
        const apiError: ApiError = {
          message:
            typeof err?.response?.data?.message === "string"
              ? err.response.data.message
              : JSON.stringify(err?.response?.data?.message) ||
                err.message ||
                "An error occurred",
          code: err.code,
          errors: err.errors,
        };
        setError(apiError);
        options?.onError?.(apiError);
        throw apiError;
      } finally {
        setLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, execute, reset };
};

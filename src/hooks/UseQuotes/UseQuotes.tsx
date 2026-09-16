import { useCallback, useEffect, useState } from "react";

export interface Quote {
  _id?: string;
  ClientDetails?: Record<string, unknown>[];
  VehicleDetails?: Record<string, unknown>[];
  DiagnosticName: string[];
  DiagnosticTechinician?: string;
  DiagnosticComments?: string[];
  DiagnosticSpares?: string[];
  DiagnosticTotal?: number;
  DiagnosticCreationDate?: string;
  DiagnosticValid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

type QuoteData = Omit<Quote, "_id" | "createdAt" | "updatedAt">;

interface UseQuotesOptions {
  endpoint?: string;
  autoFetch?: boolean;
}

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  diagnostics?: T;
  message?: string;
}

const LOCAL_API_ENDPOINT = "http://localhost:3000/api/diagnostics";
const PRODUCTION_API_ENDPOINT =
  "https://vehicle-inspection-app-server.onrender.com/api/diagnostics";

const defaultEndpoint =
  typeof window !== "undefined" &&
  (window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1")
    ? LOCAL_API_ENDPOINT
    : PRODUCTION_API_ENDPOINT;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "An unexpected error occurred";

export default function useQuotes({
  endpoint = defaultEndpoint,
  autoFetch = true,
}: UseQuotesOptions = {}) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(async <T,>(url: string, options?: RequestInit) => {
    const response = await fetch(url, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
    const result = (await response.json().catch(() => ({}))) as ApiResponse<T> | T;
    if (!response.ok) {
      const message = (result as ApiResponse<T>).message || "Request failed";
      throw new Error(message);
    }
    const apiResult = result as ApiResponse<T>;
    return apiResult.data ?? apiResult.diagnostics ?? (result as T);
  }, []);

  const apiEndpoint = endpoint.replace(/\/$/, "");

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const result = await request<Quote[]>(apiEndpoint);
      setQuotes(result);
      setError(null);
      return result;
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, request]);

  const fetchQuote = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const result = await request<Quote>(`${apiEndpoint}/${encodeURIComponent(id)}`);
      setSelectedQuote(result);
      setError(null);
      return result;
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, request]);

  const createQuote = useCallback(async (data: QuoteData) => {
    setLoading(true);
    try {
      const result = await request<Quote>(apiEndpoint, { method: "POST", body: JSON.stringify(data) });
      setQuotes((current) => [...current, result]);
      setSelectedQuote(result);
      setError(null);
      return result;
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, request]);

  const updateQuote = useCallback(async (id: string, data: Partial<QuoteData>) => {
    setLoading(true);
    try {
      const result = await request<Quote>(`${apiEndpoint}/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(data) });
      setQuotes((current) => current.map((item) => item._id === id ? result : item));
      setSelectedQuote(result);
      setError(null);
      return result;
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, request]);

  const deleteQuote = useCallback(async (id: string) => {
    setLoading(true);
    try {
      await request(`${apiEndpoint}/${encodeURIComponent(id)}`, { method: "DELETE" });
      setQuotes((current) => current.filter((item) => item._id !== id));
      setSelectedQuote((current) => current?._id === id ? null : current);
      setError(null);
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, request]);

  const downloadQuoteReport = useCallback(async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiEndpoint}/${encodeURIComponent(id)}/report`, {
        headers: { Accept: "application/pdf" },
      });

      if (!response.ok) {
        const result = (await response.json().catch(() => ({}))) as ApiResponse<unknown>;
        throw new Error(result.message || "Request failed");
      }

      const report = await response.blob();
      setError(null);
      return report;
    } catch (error) {
      setError(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint]);

  useEffect(() => {
    if (autoFetch) void fetchQuotes();
  }, [autoFetch, fetchQuotes]);

  return {
    quotes,
    selectedQuote,
    loading,
    error,
    fetchQuotes,
    fetchQuote,
    createQuote,
    updateQuote,
    deleteQuote,
    downloadQuoteReport,
    clearError: () => setError(null),
  };
}

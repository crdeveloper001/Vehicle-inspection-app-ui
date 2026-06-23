import { useCallback } from "react";
import { PurchaseReport } from "../../interfaces/PurchaseReport";

type InspectionPayload = Omit<PurchaseReport, "_id" | "createdAt" | "updatedAt"> & {
  selected?: boolean;
};

type InspectionRecord = Omit<PurchaseReport, "createdAt" | "updatedAt"> & {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
  selected?: boolean;
};


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'https://vehicle-inspection-app-server.onrender.com';
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
const REPORTS_ENDPOINT = `${API_BASE_URL}/api/inspections`;

const parseResponse = async <T,>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!response.ok) {
    const message = text || response.statusText;
    throw new Error(message);
  }
  return text ? JSON.parse(text) : ({} as T);
};

const useReports = () => {
  const createInspectionAndPDF = useCallback(
    async (payload: InspectionPayload): Promise<Blob> => {
      
      const response = await fetch(REPORTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || response.statusText);
      }

      return await response.blob();
    },
    []
  );

  const downloadInspectionPDF = useCallback(async (id: string): Promise<Blob> => {
    const response = await fetch(`${REPORTS_ENDPOINT}/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || response.statusText);
    }

    return await response.blob();
  }, []);

  const getAllInspections = useCallback(async (): Promise<InspectionRecord[]> => {
    const response = await fetch(REPORTS_ENDPOINT, {
      method: "GET",
      
    });

    return (await parseResponse(response)) as InspectionRecord[];
  }, []);

  const updateInspectionSelected = useCallback(
    async (id: string, update: Partial<InspectionPayload>): Promise<InspectionRecord> => {
      const response = await fetch(`${REPORTS_ENDPOINT}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(update),
        credentials: "include",
      });

      return (await parseResponse(response)) as InspectionRecord;
    },
    []
  );

  return {
    createInspectionAndPDF,
    downloadInspectionPDF,
    getAllInspections,
    updateInspectionSelected,
  };
};

export default useReports;

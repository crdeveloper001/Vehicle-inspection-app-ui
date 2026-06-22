import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { ClientType } from '../../interfaces/Clients';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000';
const CLIENTS_ENDPOINT = `${API_BASE_URL}/api/clients`;

type CreateClientPayload = Omit<ClientType, '_id' | '__v' | 'createdOn'>;

type UpdateClientPayload = Partial<Omit<ClientType, '_id' | '__v' | 'createdOn'>>;

export const useClients = () => {
  const [clients, setClients] = useState<ClientType[]>([]);
  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleError = (message: unknown) => {
    if (axios.isAxiosError(message) && message.response?.data) {
      setError(JSON.stringify(message.response.data));
      return;
    }
    setError(typeof message === 'string' ? message : 'An unexpected error occurred');
  };

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ClientType[]>(CLIENTS_ENDPOINT);
      setClients(response.data);
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClient = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<ClientType>(`${CLIENTS_ENDPOINT}/${id}`);
      setSelectedClient(response.data);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createClient = useCallback(async (payload: CreateClientPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post<ClientType>(CLIENTS_ENDPOINT, payload);
      setClients(prev => [...prev, response.data]);
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateClient = useCallback(async (id: string, payload: UpdateClientPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put<ClientType>(`${CLIENTS_ENDPOINT}/${id}`, payload);
      setClients(prev => prev.map(client => (client._id === id ? response.data : client)));
      if (selectedClient?._id === id) {
        setSelectedClient(response.data);
      }
      return response.data;
    } catch (err) {
      handleError(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  const deleteClient = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`${CLIENTS_ENDPOINT}/${id}`);
      setClients(prev => prev.filter(client => client._id !== id));
      if (selectedClient?._id === id) {
        setSelectedClient(null);
      }
      return true;
    } catch (err) {
      handleError(err);
      return false;
    } finally {
      setLoading(false);
    }
  }, [selectedClient]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    selectedClient,
    loading,
    error,
    fetchClients,
    fetchClient,
    createClient,
    updateClient,
    deleteClient,
    setSelectedClient,
  };
};

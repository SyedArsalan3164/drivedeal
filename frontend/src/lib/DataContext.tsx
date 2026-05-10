"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Car, ClientRequest } from '../data/mockData';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper to get token from storage
const getToken = () => {
  const user = localStorage.getItem('drivedeal_user');
  return user ? JSON.parse(user).token : null;
};

interface DataContextType {
  cars: Car[];
  requests: ClientRequest[];
  uploadImages: (files: File[]) => Promise<string[]>;
  addCar: (car: Omit<Car, 'id'>) => Promise<void>;
  updateCar: (id: string, updates: Partial<Car>) => Promise<void>;
  deleteCar: (id: string) => Promise<void>;
  addRequest: (request: Omit<ClientRequest, 'id' | 'status'>) => Promise<void>;
  updateRequestStatus: (id: string, status: 'Pending' | 'Contacted') => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cars, setCars] = useState<Car[]>([]);
  const [requests, setRequests] = useState<ClientRequest[]>([]);

  // Fetch initial data
  useEffect(() => {
    fetchCars();
    // We only fetch requests if we are logged in as admin, but for simplicity let's try
    const token = getToken();
    if (token) fetchRequests();
  }, []);

  const fetchCars = async () => {
    try {
      const res = await fetch(`${API_URL}/cars`);
      const data = await res.json();
      // Map _id to id for frontend compatibility
      const mappedCars = data.map((car: any) => ({ ...car, id: car._id }));
      setCars(mappedCars);
    } catch (err) {
      console.error("Error fetching cars:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const token = getToken();
      if (!token) return;
      const res = await fetch(`${API_URL}/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.status === 401) {
        console.warn("Session expired or unauthorized. Clearing token.");
        localStorage.removeItem('drivedeal_user');
        localStorage.removeItem('drivedeal_role');
        return;
      }

      const data = await res.json();
      if (Array.isArray(data)) {
        const mappedReqs = data.map((req: any) => ({ ...req, id: req._id }));
        setRequests(mappedReqs);
      }
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const uploadImages = async (files: File[]): Promise<string[]> => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const res = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`
        },
        body: formData
      });

      if (!res.ok) throw new Error("Failed to upload images");

      const data = await res.json();
      return data.urls;
    } catch (err: any) {
      toast.error(err.message);
      throw err;
    }
  };

  const addCar = async (carData: Omit<Car, 'id'>) => {
    try {
      const res = await fetch(`${API_URL}/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(carData)
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('drivedeal_user');
        localStorage.removeItem('drivedeal_role');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) throw new Error("Failed to add car");

      const newCar = await res.json();
      setCars(prev => [{ ...newCar, id: newCar._id }, ...prev]);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateCar = async (id: string, updates: Partial<Car>) => {
    try {
      const res = await fetch(`${API_URL}/cars/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(updates)
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('drivedeal_user');
        localStorage.removeItem('drivedeal_role');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) throw new Error("Failed to update car");
      await fetchCars(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const deleteCar = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/cars/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${getToken()}` }
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('drivedeal_user');
        localStorage.removeItem('drivedeal_role');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) throw new Error("Failed to delete car");
      setCars(prev => prev.filter(car => car.id !== id));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const addRequest = async (requestData: Omit<ClientRequest, 'id' | 'status'>) => {
    try {
      const res = await fetch(`${API_URL}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!res.ok) throw new Error("Failed to submit request");
      toast.success("Request sent successfully!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const updateRequestStatus = async (id: string, status: 'Pending' | 'Contacted') => {
    try {
      const res = await fetch(`${API_URL}/requests/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status })
      });

      if (res.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem('drivedeal_user');
        localStorage.removeItem('drivedeal_role');
        window.location.href = '/login';
        return;
      }

      if (!res.ok) throw new Error("Failed to update status");
      await fetchRequests(); // Refresh
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <DataContext.Provider value={{ cars, requests, uploadImages, addCar, updateCar, deleteCar, addRequest, updateRequestStatus }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};



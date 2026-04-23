"use client";
export interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  transmission: 'Manual' | 'Automatic';
  location: string;
  images: string[];
  ownerHistory: string;
  description: string;
  status: 'Available' | 'Sold';
}

export interface ClientRequest {
  id: string;
  clientName: string;
  phone: string;
  carId: string;
  visitDate: string;
  message: string;
  status: 'Pending' | 'Contacted';
}

export const mockCars: Car[] = [];

export const mockRequests: ClientRequest[] = [];



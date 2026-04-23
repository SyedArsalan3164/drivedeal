"use client";
import React from 'react';
import Link from 'next/link';
import { MapPin, Settings, Fuel, Gauge, ArrowRight } from 'lucide-react';
import { Car } from '../data/mockData';

interface CarCardProps {
  car: Car;
}

export const CarCard: React.FC<CarCardProps> = ({ car }) => {
  return (
    <div className="card group relative overflow-hidden flex flex-col h-full">
      <div className="relative h-64 overflow-hidden bg-slate-100">
        <img 
          src={car.images?.[0] || 'https://picsum.photos/seed/car/400/300'} 
          alt={`${car.brand} ${car.model}`} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg font-bold text-slate-900 shadow-sm">
          ₹{(car.price || 0).toLocaleString()}
        </div>

        {car.status === 'Sold' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold tracking-wider uppercase shadow-lg">SOLD</span>
          </div>
        )}
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="text-blue-600 font-semibold text-sm mb-1">{car.year}</div>
          <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
            {car.brand} {car.model}
          </h3>
        </div>
        
        <div className="grid grid-cols-2 gap-y-3 gap-x-4 mb-6 mt-auto">
          <div className="flex items-center gap-2 text-slate-600">
            <Gauge className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium">{(car.mileage || 0).toLocaleString()} Km/l</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Fuel className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium">{car.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Settings className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium">{car.transmission}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="h-4 w-4 text-slate-400" />
            <span className="text-sm font-medium truncate">{car.location}</span>
          </div>
        </div>
        
        <Link 
          href={`/car/${car.id}`}
          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 text-blue-600 font-medium rounded-xl hover:bg-blue-50 transition-colors mt-auto border border-slate-100"
        >
          View Details
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};



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
    <div className="car-card-new group flex flex-col h-full">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-slate-100">
        <img
          src={car.images?.[0] || 'https://picsum.photos/seed/car/400/300'}
          alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Sold overlay */}
        {car.status === 'Sold' && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold tracking-wider uppercase shadow-lg">SOLD</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-grow">
        {/* Title */}
        <div className="mb-3">
          <h3 className="text-base font-bold text-slate-900 leading-snug group-hover:text-[#3aab5c] transition-colors">
            {car.brand} {car.model}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-slate-500 text-xs">
            <MapPin className="h-3.5 w-3.5 text-[#3aab5c]" />
            <span>{car.location || 'Karnataka, India'}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-100 mb-4">
          <div className="flex flex-col items-center gap-1 text-center">
            <Gauge className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">{(car.mileage || 0).toLocaleString()} km</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Settings className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">{car.transmission || 'Auto'}</span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Fuel className="h-4 w-4 text-slate-400" />
            <span className="text-xs text-slate-600 font-medium">{car.fuelType || 'Petrol'}</span>
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">From</p>
            <p className="text-lg font-extrabold text-slate-900">
              ₹{(car.price || 0).toLocaleString('en-IN')}
            </p>
          </div>

          <Link
            href={`/car/${car.id}`}
            className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2.5 rounded-lg bg-[#3aab5c] text-white hover:bg-[#2d8f4b] transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

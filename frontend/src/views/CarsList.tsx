"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Car } from 'lucide-react';
import { useData } from '../lib/DataContext';
import { CarCard } from '../components/CarCard';
import { useSearchParams } from 'next/navigation';

// Static fallback options so dropdowns always show even before cars load
const FUEL_OPTIONS = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];
const TRANSMISSION_OPTIONS = ['Automatic', 'Manual', 'Semi-Automatic'];

export const CarsList = ({ initialCars = [] }: { initialCars?: any[] }) => {
  const { cars: contextCars } = useData();
  const cars = initialCars.length > 0 ? initialCars : contextCars;
  const searchParams = useSearchParams();

  // Read ?search= from URL on first render (brand icon click from Home)
  const urlSearch = searchParams?.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [fuelFilter, setFuelFilter] = useState('');
  const [transmissionFilter, setTransmissionFilter] = useState('');

  // Sync if URL param changes (e.g. browser back/forward)
  useEffect(() => {
    setSearchTerm(urlSearch);
  }, [urlSearch]);

  // Merge static options with any extra values found in data
  const fuelTypes = useMemo(() => {
    const fromData = cars.map((c: any) => c.fuelType).filter(Boolean);
    return [...new Set([...FUEL_OPTIONS, ...fromData])];
  }, [cars]);

  const transmissions = useMemo(() => {
    const fromData = cars.map((c: any) => c.transmission).filter(Boolean);
    return [...new Set([...TRANSMISSION_OPTIONS, ...fromData])];
  }, [cars]);

  const sortedFilteredCars = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase().trim();

    const filtered = cars.filter((car: any) => {
      const matchesSearch =
        !lowerSearch ||
        car.brand?.toLowerCase().includes(lowerSearch) ||
        car.model?.toLowerCase().includes(lowerSearch) ||
        car.location?.toLowerCase().includes(lowerSearch);
      const matchesFuel = fuelFilter ? car.fuelType === fuelFilter : true;
      const matchesTransmission = transmissionFilter ? car.transmission === transmissionFilter : true;
      return matchesSearch && matchesFuel && matchesTransmission;
    });

    // If searching by brand name, sort exact brand matches to the top
    if (lowerSearch) {
      return [...filtered].sort((a: any, b: any) => {
        const aIsBrand = a.brand?.toLowerCase().startsWith(lowerSearch) ? 0 : 1;
        const bIsBrand = b.brand?.toLowerCase().startsWith(lowerSearch) ? 0 : 1;
        return aIsBrand - bIsBrand;
      });
    }

    return filtered;
  }, [searchTerm, fuelFilter, transmissionFilter, cars]);

  const clearAll = () => {
    setSearchTerm('');
    setFuelFilter('');
    setTransmissionFilter('');
  };

  const hasFilters = searchTerm || fuelFilter || transmissionFilter;

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      {/* Page Header */}
      <div className="bg-[#151c25] pt-28 pb-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <p className="text-[#3aab5c] font-semibold text-xs uppercase tracking-widest mb-2">Our Inventory</p>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white">Vehicle Collection</h1>
              <p className="text-slate-400 mt-3 max-w-md text-sm">
                Explore our curated selection of premium vehicles, each verified for provenance and quality.
              </p>
            </div>
            <div className="text-slate-400 text-sm">
              <span className="text-white font-bold text-2xl">{sortedFilteredCars.length}</span> vehicles found
            </div>
          </div>
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col sm:flex-row gap-3 items-center">

            {/* Search */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by brand, model, or location..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 w-full border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all bg-slate-50"
              />
            </div>

            {/* Fuel Type */}
            <select
              value={fuelFilter}
              onChange={e => setFuelFilter(e.target.value)}
              className="py-2.5 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all min-w-[140px]"
            >
              <option value="">All Fuel Types</option>
              {fuelTypes.map((f: any) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            {/* Transmission */}
            <select
              value={transmissionFilter}
              onChange={e => setTransmissionFilter(e.target.value)}
              className="py-2.5 px-3 border border-slate-200 rounded-lg text-sm text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all min-w-[150px]"
            >
              <option value="">All Transmissions</option>
              {transmissions.map((t: any) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>

            {/* Clear All */}
            {hasFilters && (
              <button
                onClick={clearAll}
                className="text-sm text-slate-500 hover:text-[#3aab5c] font-medium whitespace-nowrap transition-colors px-3 py-2.5 rounded-lg border border-slate-200 hover:border-[#3aab5c] bg-white"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Active filter pills */}
          {hasFilters && (
            <div className="flex flex-wrap gap-2 mt-2.5">
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-[#e8f8ee] text-[#3aab5c] px-3 py-1 rounded-full">
                  Search: "{searchTerm}"
                  <button onClick={() => setSearchTerm('')} className="ml-0.5 hover:text-[#2d8f4b] font-bold">×</button>
                </span>
              )}
              {fuelFilter && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                  Fuel: {fuelFilter}
                  <button onClick={() => setFuelFilter('')} className="ml-0.5 hover:text-blue-900 font-bold">×</button>
                </span>
              )}
              {transmissionFilter && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                  Transmission: {transmissionFilter}
                  <button onClick={() => setTransmissionFilter('')} className="ml-0.5 hover:text-purple-900 font-bold">×</button>
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Car Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {sortedFilteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedFilteredCars.map((car: any) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <Car className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">No Vehicles Found</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6 text-sm">
              We couldn't find any vehicles matching your current filters.
            </p>
            <button onClick={clearAll} className="btn-primary text-sm px-6 py-2.5 rounded-lg">
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

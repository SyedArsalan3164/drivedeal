import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { useData } from './DataContext';
import { CarCard } from '../components/CarCard';

export const CarsList = () => {
  const { cars } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      return car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             car.location?.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [searchTerm, cars]);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8 border-b border-slate-200 pb-12">
          <div>
            <div className="text-blue-600 font-semibold mb-2 uppercase tracking-wider text-sm">Inventory</div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900">Vehicle Collection</h1>
            <p className="text-slate-600 mt-4 max-w-md">Explore our curated selection of premium vehicles, each verified for provenance and quality.</p>
          </div>
          
          <div className="w-full md:w-96 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search by marque, model, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-4 w-full bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
            />
          </div>
        </div>

        {filteredCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-blue-600 font-semibold mb-2 uppercase tracking-wider text-sm">Search Results</div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">No Vehicles Found</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">We couldn't find any vehicles matching your current search criteria in our collection.</p>
            <button 
              onClick={() => setSearchTerm('')}
              className="px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-lg hover:bg-slate-200 transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

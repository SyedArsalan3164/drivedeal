"use client";
import React, { useState } from 'react';
import { useData } from '../lib/DataContext';
import { Edit, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';

export const ManageCars = () => {
  const { cars, deleteCar, updateCar } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    
    if (window.confirm('Are you sure you want to remove this vehicle from the collection?')) {
      deleteCar(id);
      toast.success('Vehicle removed successfully');
    }
  };

  const toggleStatus = (id: string) => {
    const car = cars.find(c => c.id === id);
    if (car) {
      const newStatus = car.status === 'Available' ? 'Sold' : 'Available';
      updateCar(id, { status: newStatus });
      toast.success(`Vehicle marked as ${newStatus}`);
    }
  };

  const filteredCars = cars.filter(car => 
    car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    car.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="text-slate-900">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Collection</h1>
          <p className="text-slate-500">View and edit your current inventory.</p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search collection..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl py-2.5 pl-11 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 text-sm">
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Vehicle</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCars.map(car => (
                <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="h-16 w-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-200">
                      <img src={car.images?.[0] || 'https://picsum.photos/seed/car/400/300'} alt={car.brand} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{car.brand} {car.model}</div>
                    <div className="text-sm text-slate-500">{car.year} • {(car.mileage || 0).toLocaleString()} Km/l</div>
                  </td>
                  <td className="p-4 font-semibold text-blue-600">
                    ₹{(car.price || 0).toLocaleString()}
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    {car.location}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => toggleStatus(car.id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                        car.status === 'Available' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      {car.status}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                        onClick={() => toast('Edit functionality would open a modal or navigate to edit page')}
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(car.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCars.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    No vehicles found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};



"use client";
import React from 'react';
import { useData } from '../lib/DataContext';
import { Mail, Phone, Calendar, CheckCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

export const ClientRequests = () => {
  const { requests, cars, updateRequestStatus } = useData();

  const markAsContacted = (id: string) => {
    updateRequestStatus(id, 'Contacted');
    toast.success('Inquiry marked as contacted');
  };

  return (
    <div className="text-slate-900">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Client Inquiries</h1>
        <p className="text-slate-500">Manage requests for private viewings and consultations.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 bg-slate-50 text-sm">
                <th className="p-4 font-semibold">Client Info</th>
                <th className="p-4 font-semibold">Vehicle of Interest</th>
                <th className="p-4 font-semibold">Requested Date</th>
                <th className="p-4 font-semibold">Message</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map(request => {
                // Backend populates carId, so it might be an object containing the car details
                const car = typeof request.carId === 'object' && request.carId !== null
                  ? request.carId as any
                  : cars.find(c => c.id === request.carId);

                return (
                  <tr key={request.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="font-semibold text-slate-900">{request.clientName}</div>
                      <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                        <Phone className="h-3 w-3 text-blue-600" /> {request.phone}
                      </div>
                    </td>
                    <td className="p-4">
                      {car ? (
                        <div className="flex items-center gap-3">
                          {car.images && car.images.length > 0 && (
                            <img src={car.images[0]} alt={car.model} className="w-12 h-8 object-cover rounded shadow-sm" />
                          )}
                          <div>
                            <div className="font-medium text-slate-900">{car.brand} {car.model}</div>
                            <div className="text-sm text-blue-600 font-semibold">₹{(car.price || 0).toLocaleString()}</div>
                          </div>
                        </div>
                      ) : (request as any).vehicleBrand ? (
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-12 h-8 bg-slate-100 rounded text-slate-400 text-xs shadow-sm">
                            N/A
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{(request as any).vehicleBrand} {(request as any).vehicleModel}</div>
                            <div className="text-sm text-blue-600 font-semibold">₹{((request as any).vehiclePrice || 0).toLocaleString()} <span className="text-xs text-slate-400 font-normal">(Deleted Vehicle)</span></div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Vehicle not found</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        {new Date(request.visitDate).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-500 max-w-xs truncate italic" title={request.message}>
                        "{request.message}"
                      </p>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${request.status === 'Pending'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                        {request.status === 'Pending' ? <Clock className="h-3 w-3" /> : <CheckCircle className="h-3 w-3" />}
                        {request.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {request.status === 'Pending' && (
                        <button
                          onClick={() => markAsContacted(request.id)}
                          className="px-4 py-2 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          Mark Contacted
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {requests.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    No client inquiries found.
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



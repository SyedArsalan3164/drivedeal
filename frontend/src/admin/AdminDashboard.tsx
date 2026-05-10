"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, Users, DollarSign, TrendingUp, PlusCircle, LogOut, ArrowRight, CheckCircle } from 'lucide-react';
import { useData } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext';

export const AdminDashboard = () => {
  const { cars, requests } = useData();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => { logout(); router.push('/'); };

  const totalCars = cars.length;
  const availableCars = cars.filter(c => c.status === 'Available').length;
  const soldCars = cars.filter(c => c.status === 'Sold').length;
  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const inventoryValue = cars.filter(c => c.status === 'Available').reduce((sum, car) => sum + (car.price || 0), 0);

  const stats = [
    {
      label: 'Total Cars',
      value: totalCars,
      sub: `${availableCars} available · ${soldCars} sold`,
      icon: Car,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600',
      accent: 'border-l-blue-500',
    },
    {
      label: 'Client Requests',
      value: totalRequests,
      sub: `${pendingRequests} pending review`,
      icon: Users,
      iconBg: 'bg-[#e8f8ee]',
      iconColor: 'text-[#3aab5c]',
      accent: 'border-l-[#3aab5c]',
    },
    {
      label: 'Inventory Value',
      value: `₹${inventoryValue.toLocaleString('en-IN')}`,
      sub: 'Based on available cars',
      icon: DollarSign,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600',
      accent: 'border-l-amber-500',
    },
    {
      label: 'Sold This Month',
      value: soldCars,
      sub: 'Total sold vehicles',
      icon: TrendingUp,
      iconBg: 'bg-purple-50',
      iconColor: 'text-purple-600',
      accent: 'border-l-purple-500',
    },
  ];

  return (
    <div className="px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back. Here's what's happening with your dealership today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map(({ label, value, sub, icon: Icon, iconBg, iconColor, accent }) => (
          <div key={label} className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 border-l-4 ${accent}`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
                <h3 className="text-2xl font-extrabold text-slate-900">{value}</h3>
              </div>
              <div className={`p-2.5 ${iconBg} rounded-xl`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
            </div>
            <p className="text-xs text-slate-400">{sub}</p>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Requests */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Requests</h2>
              <p className="text-xs text-slate-400 mt-0.5">{pendingRequests} pending</p>
            </div>
            <Link href="/admin/requests" className="flex items-center gap-1 text-xs font-semibold text-[#3aab5c] hover:text-[#2d8f4b] transition-colors">
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-50">
            {requests.slice(0, 4).map(request => {
              const car = cars.find(c => c.id === request.carId);
              return (
                <div key={request.id} className="px-6 py-4 hover:bg-[#f5f7fa] transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-semibold text-slate-900 text-sm">{request.clientName}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                      request.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-[#e8f8ee] text-[#3aab5c]'
                    }`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-0.5">
                    Interested in: <span className="font-medium text-slate-700">{car?.brand} {car?.model}</span>
                  </p>
                  <p className="text-xs text-slate-400 truncate">"{request.message}"</p>
                </div>
              );
            })}
            {requests.length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">
                No requests yet.
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-base font-bold text-slate-900">Quick Actions</h2>
            <p className="text-xs text-slate-400 mt-0.5">Common tasks at a glance</p>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/admin/add-car"
              className="flex items-center gap-4 p-5 bg-[#f5f7fa] rounded-xl border border-slate-200 hover:border-[#3aab5c] hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <PlusCircle className="h-5 w-5 text-[#3aab5c]" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block">Add New Car</span>
                <span className="text-xs text-slate-400">List a vehicle</span>
              </div>
            </Link>

            <Link
              href="/admin/manage"
              className="flex items-center gap-4 p-5 bg-[#f5f7fa] rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Car className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block">Manage Cars</span>
                <span className="text-xs text-slate-400">Edit inventory</span>
              </div>
            </Link>

            <Link
              href="/admin/requests"
              className="flex items-center gap-4 p-5 bg-[#f5f7fa] rounded-xl border border-slate-200 hover:border-amber-400 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <span className="font-semibold text-slate-900 text-sm block">Client Inquiries</span>
                <span className="text-xs text-slate-400">{pendingRequests} pending</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="flex items-center gap-4 p-5 bg-red-50 rounded-xl border border-red-100 hover:border-red-300 hover:shadow-sm transition-all group text-left"
            >
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <LogOut className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <span className="font-semibold text-red-600 text-sm block">Logout</span>
                <span className="text-xs text-red-400">End session</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

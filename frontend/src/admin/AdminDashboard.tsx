import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Car, Users, DollarSign, TrendingUp, PlusCircle, LogOut } from 'lucide-react';
import { useData } from '../pages/DataContext';
import { useAuth } from '../pages/AuthContext';

export const AdminDashboard = () => {
  const { cars, requests } = useData();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalCars = cars.length;
  const availableCars = cars.filter(c => c.status === 'Available').length;
  const soldCars = cars.filter(c => c.status === 'Sold').length;

  const totalRequests = requests.length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  const inventoryValue = cars
    .filter(c => c.status === 'Available')
    .reduce((sum, car) => sum + (car.price || 0), 0);

  return (
    <div className="text-slate-900 px-4 md:px-6 lg:px-8 py-6">


      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
        <p className="text-slate-500">
          Welcome back. Here is what's happening with your dealership today.
        </p>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">


        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Cars</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalCars}</h3>
            </div>

            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Car className="h-6 w-6" />
            </div>
          </div>

          <div className="text-sm text-slate-500">
            <span className="text-emerald-600 font-medium">{availableCars}</span> available,{" "}
            <span className="text-slate-400">{soldCars}</span> sold
          </div>
        </div>


        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Client Requests</p>
              <h3 className="text-3xl font-bold text-slate-900">{totalRequests}</h3>
            </div>

            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Users className="h-6 w-6" />
            </div>
          </div>

          <div className="text-sm text-slate-500">
            <span className="text-amber-600 font-medium">{pendingRequests}</span> pending review
          </div>
        </div>


        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Inventory Value</p>
              <h3 className="text-3xl font-bold text-slate-900">
                ₹ {inventoryValue.toLocaleString('en-IN')}
              </h3>
            </div>

            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="h-6 w-6" />
            </div>
          </div>

          <div className="text-sm text-slate-500">
            Based on available cars
          </div>
        </div>



      </div>


      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">


        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-900">Recent Requests</h2>

            <Link
              to="/admin/requests"
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">

            {requests.slice(0, 3).map(request => {
              const car = cars.find(c => c.id === request.carId);

              return (
                <div key={request.id} className="p-6 hover:bg-slate-50 transition-colors">

                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900">
                      {request.clientName}
                    </h3>

                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${request.status === 'Pending'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-600'
                      }`}>
                      {request.status}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mb-1">
                    Interested in:{" "}
                    <span className="font-medium text-slate-700">
                      {car?.brand} {car?.model}
                    </span>
                  </p>

                  <p className="text-sm text-slate-400 truncate">
                    "{request.message}"
                  </p>

                </div>
              );
            })}

            {requests.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                No recent requests
              </div>
            )}

          </div>
        </div>


        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
          </div>

          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">


            <Link
              to="/admin/add-car"
              className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="h-6 w-6 text-blue-600" />
              </div>

              <span className="font-medium text-slate-900">
                Add New Car
              </span>
            </Link>


            <Link
              to="/admin/manage"
              className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group"
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <Car className="h-6 w-6 text-blue-600" />
              </div>

              <span className="font-medium text-slate-900">
                Manage Cars
              </span>
            </Link>


            <button
              onClick={handleLogout}
              className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-xl border border-red-200 hover:border-red-400 hover:shadow-md transition-all group"
            >
              <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                <LogOut className="h-6 w-6 text-red-600" />
              </div>

              <span className="font-medium text-red-600">
                Logout
              </span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};
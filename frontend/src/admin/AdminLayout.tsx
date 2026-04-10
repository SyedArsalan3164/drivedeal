import React from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../pages/AuthContext';
import { LayoutDashboard, Car, PlusCircle, Users, LogOut } from 'lucide-react';

export const AdminLayout = () => {
  const { role, logout } = useAuth();
  const location = useLocation();

  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard Overview' },
    { path: '/admin/manage', icon: Car, label: 'Manage Cars' },
    { path: '/admin/add-car', icon: PlusCircle, label: 'Add New Car' },
    { path: '/admin/requests', icon: Users, label: 'Client Requests' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-white border-r border-slate-200 flex flex-col md:min-h-screen sticky top-24 md:top-0 z-40 shadow-sm">
        <div className="p-8 border-b border-slate-100 hidden md:block">
          <h2 className="text-2xl font-bold text-slate-900">Admin Portal</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Dealership Management</p>
        </div>
        
        <nav className="flex-1 px-4 py-4 md:py-8 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap font-medium ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-slate-100 hidden md:block">
          <button 
            onClick={() => logout()}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left font-medium"
          >
            <LogOut className="h-5 w-5 text-slate-400" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

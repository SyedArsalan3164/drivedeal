"use client";
import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { LayoutDashboard, Car, PlusCircle, Users, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const { role, logout } = useAuth();
  const router = useRouter();

  if (role !== 'admin') {
    return <div className="text-red-500 font-bold p-8">Unauthorized access. Please login as admin.</div>;
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col fixed h-full z-20">
        <div className="p-6">
          <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
            <Car className="h-8 w-8 text-blue-500" />
            DriveDeal
          </Link>
          <div className="mt-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin Portal</div>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="h-5 w-5" /> Dashboard
          </Link>
          <Link href="/admin/manage" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <Car className="h-5 w-5" /> Manage Cars
          </Link>
          <Link href="/admin/add-car" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <PlusCircle className="h-5 w-5" /> Add New Car
          </Link>
          <Link href="/admin/requests" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-colors">
            <Users className="h-5 w-5" /> Client Inquiries
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-400 hover:bg-slate-800 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-5 w-5" /> Logout
          </button>
        </div>
      </aside>

      
      <main className="flex-1 ml-64 bg-slate-50 min-h-screen">
        {children}
      </main>
    </div>
  );
};

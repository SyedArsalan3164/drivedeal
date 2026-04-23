"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { Lock, Mail, User as UserIcon, Car } from 'lucide-react';
import toast from 'react-hot-toast';

export const Login = () => {
  const [activeTab, setActiveTab] = useState('client');
  const { login } = useAuth();
  const router = useRouter();
  const [clientEmail, setClientEmail] = useState('');
  const [clientPassword, setClientPassword] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  const performLogin = async (email, password) => {
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      login(data.role === 'admin' ? 'admin' : 'client', data);
      toast.success('Welcome back, ' + data.name + '!');
      router.push(data.role === 'admin' ? '/admin/dashboard' : '/cars');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleClientLogin = (e) => {
    e.preventDefault();
    if (!clientEmail || !clientPassword) { toast.error('Please fill in all fields'); return; }
    performLogin(clientEmail, clientPassword);
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) { toast.error('Please fill in all fields'); return; }
    performLogin(adminEmail, adminPassword);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Car className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">Welcome back</h2>
        <p className="mt-2 text-center text-sm text-slate-600">Sign in to your account</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          <div className="flex border-b border-slate-200 mb-8">
            <button className={"flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors " + (activeTab === 'client' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500')} onClick={() => setActiveTab('client')}>Client</button>
            <button className={"flex-1 py-4 text-sm font-semibold text-center border-b-2 transition-colors " + (activeTab === 'admin' ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500')} onClick={() => setActiveTab('admin')}>Admin</button>
          </div>
          {activeTab === 'client' && (
            <div>
              <form className="space-y-6" onSubmit={handleClientLogin}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                    <input type="email" required value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="client@example.com" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">Password</label>
                    <Link href="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                    <input type="password" required value={clientPassword} onChange={(e) => setClientPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="..." />
                  </div>
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm">Sign In</button>
              </form>
              <div className="mt-8">
                <Link href="/signup" className="w-full flex justify-center py-3.5 px-4 border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">Create Account</Link>
              </div>
            </div>
          )}
          {activeTab === 'admin' && (
            <form className="space-y-6" onSubmit={handleAdminLogin}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Admin Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-slate-400" /></div>
                  <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="admin@drivedeal.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                  <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="..." />
                </div>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white hover:bg-slate-800 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm">Access Dashboard</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { Lock, Mail, User as UserIcon, Car, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

const inputClass = "w-full bg-[#f5f7fa] border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all text-sm";

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
    <div className="min-h-screen bg-[#f5f7fa] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#151c25] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #3aab5c 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="p-2 rounded-xl bg-[#3aab5c]">
            <Car className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl text-white">DriveDeal</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold text-white mb-4 leading-tight">
            Your perfect car<br /><span className="text-[#3aab5c]">is waiting for you.</span>
          </h2>
          <p className="text-slate-400 text-base mb-10">Sign in to browse verified vehicles and connect with our dealers across Karnataka and India.</p>
          <div className="space-y-4">
            {['150-point verified inspections', 'Transparent, no-hidden-fee pricing', '24/7 roadside support included'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#3aab5c]/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-[#3aab5c]" />
                </div>
                <span className="text-slate-300 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs relative z-10">&copy; {new Date().getFullYear()} DriveDeal. All rights reserved.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#3aab5c]"><Car className="h-6 w-6 text-white" /></div>
              <span className="font-bold text-xl text-slate-900">DriveDeal</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your account to continue</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-[#f5f7fa] p-1 rounded-xl mb-8 border border-slate-200">
            {[['client', 'Client'], ['admin', 'Admin']].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${activeTab === key ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {activeTab === 'client' && (
              <form className="space-y-5" onSubmit={handleClientLogin}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="email" required value={clientEmail} onChange={e => setClientEmail(e.target.value)} className={inputClass} placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <Link href="/forgot-password" className="text-xs font-medium text-[#3aab5c] hover:text-[#2d8f4b]">Forgot password?</Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="password" required value={clientPassword} onChange={e => setClientPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#3aab5c] text-white hover:bg-[#2d8f4b] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-sm">
                  Sign In
                </button>
              </form>
            )}

            {activeTab === 'admin' && (
              <form className="space-y-5" onSubmit={handleAdminLogin}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Admin Email</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="email" required value={adminEmail} onChange={e => setAdminEmail(e.target.value)} className={inputClass} placeholder="admin@drivedeal.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input type="password" required value={adminPassword} onChange={e => setAdminPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#151c25] text-white hover:bg-[#1e2836] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2 text-sm">
                  <ShieldCheck className="h-4 w-4" />
                  Access Dashboard
                </button>
              </form>
            )}

            {activeTab === 'client' && (
              <div className="mt-6 pt-5 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link href="/signup" className="font-bold text-[#3aab5c] hover:text-[#2d8f4b]">Create one</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

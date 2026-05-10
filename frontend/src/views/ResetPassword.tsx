"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Lock, Car, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const params = useParams();
  const resetToken = params?.resetToken as string;
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/resetpassword/${resetToken}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      toast.success('Password reset successful! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-[#f5f7fa] border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent text-sm";

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/" className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#3aab5c]"><Car className="h-6 w-6 text-white" /></div>
            <span className="font-bold text-xl text-slate-900">DriveDeal</span>
          </div>
        </Link>

        <div className="bg-white shadow-sm border border-slate-100 rounded-2xl p-8">
          <div className="mb-6">
            <div className="w-12 h-12 bg-[#e8f8ee] rounded-xl flex items-center justify-center mb-4">
              <CheckCircle2 className="h-6 w-6 text-[#3aab5c]" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Create new password</h1>
            <p className="text-slate-500 text-sm">Your new password must be different from previously used passwords.</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={inputClass} placeholder="••••••••" />
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-[#3aab5c] text-white hover:bg-[#2d8f4b] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-70 text-sm">
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#3aab5c] transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1.5" /> Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

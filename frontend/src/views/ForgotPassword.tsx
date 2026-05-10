"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Car, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/auth/forgotpassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      toast.success('Password reset link sent to your email!');
      setSent(true);
      setEmail('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
          {!sent ? (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Reset your password</h1>
                <p className="text-slate-500 text-sm">Enter your email and we'll send you a reset link.</p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="email" required value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-[#f5f7fa] border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent text-sm"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading}
                  className="w-full bg-[#3aab5c] text-white hover:bg-[#2d8f4b] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-70 text-sm">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-[#e8f8ee] rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-7 w-7 text-[#3aab5c]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Check your inbox</h2>
              <p className="text-slate-500 text-sm">We've sent a password reset link to your email. Please check your inbox and spam folder.</p>
            </div>
          )}

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

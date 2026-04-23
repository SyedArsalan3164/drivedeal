"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { Lock, Mail, User, Phone, Car, KeyRound, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export const Signup = () => {
  const { login } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState('details');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '', password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requestOtp = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill in all fields'); return;
    }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
      toast.success('Verification code sent to your email!');
      setStep('otp');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) { toast.error('Please enter a valid 6-digit OTP code'); return; }
    setIsLoading(true);
    try {
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.fullName, email: formData.email, password: formData.password, otp })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      login(data.role === 'admin' ? 'admin' : 'client', data);
      toast.success('Account created successfully!');
      router.push('/cars');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20">
            {step === 'details' ? <Car className="h-8 w-8 text-white" /> : <KeyRound className="h-8 w-8 text-white" />}
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">{step === 'details' ? 'Create an account' : 'Verify Email'}</h2>
        <p className="mt-2 text-center text-sm text-slate-600">{step === 'details' ? 'Join DriveDeal to browse and contact our dealers' : ('We sent a 6-digit code to ' + formData.email)}</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-slate-100">
          {step === 'details' ? (
            <form className="space-y-6" onSubmit={requestOtp}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                  <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} disabled={isLoading} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" placeholder="John Doe" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} disabled={isLoading} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" placeholder="you@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Phone className="h-5 w-5 text-slate-400" /></div>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} disabled={isLoading} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" placeholder="(555) 123-4567" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} disabled={isLoading} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" placeholder="..." />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Lock className="h-5 w-5 text-slate-400" /></div>
                  <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} disabled={isLoading} className="w-full bg-slate-50 border border-slate-300 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" placeholder="..." />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-70">{isLoading ? 'Verifying...' : 'Next Step'}</button>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 text-center">6-Digit Registration Code</label>
                <input type="text" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} disabled={isLoading} className="w-full text-center text-3xl tracking-widest bg-slate-50 border border-slate-300 rounded-xl py-4 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70" placeholder="000000" />
              </div>
              <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-blue-600 text-white hover:bg-blue-700 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-50">{isLoading ? 'Registering...' : 'Verify & Register'}</button>
              <div className="mt-6 text-center">
                <button type="button" onClick={() => setStep('details')} className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                  <ArrowLeft className="h-4 w-4 mr-2" />Change Email Address
                </button>
              </div>
            </form>
          )}
          {step === 'details' && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-600">Already have an account?{' '}
                <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">Sign in</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

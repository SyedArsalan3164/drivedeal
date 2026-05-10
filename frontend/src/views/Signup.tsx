"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { Lock, Mail, User, Phone, Car, KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const inputClass = "w-full bg-[#f5f7fa] border border-slate-200 rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all text-sm disabled:opacity-60";

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
    <div className="min-h-screen bg-[#f5f7fa] flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#151c25] flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #3aab5c 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <Link href="/" className="flex items-center gap-2 relative z-10">
          <div className="p-2 rounded-xl bg-[#3aab5c]"><Car className="h-6 w-6 text-white" /></div>
          <span className="font-bold text-xl text-white">DriveDeal</span>
        </Link>
        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white mb-4 leading-tight">
            Join DriveDeal<br /><span className="text-[#3aab5c]">Find your car today.</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8">Create a free account to browse our verified inventory, save favorites, and contact dealers directly.</p>
          <div className="space-y-3">
            {['Free account, no credit card needed', 'Browse thousands of verified cars', 'Instant dealer contact'].map((t, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="h-4 w-4 text-[#3aab5c] flex-shrink-0" />
                <span className="text-slate-300 text-sm">{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs relative z-10">&copy; {new Date().getFullYear()} DriveDeal</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#3aab5c]"><Car className="h-6 w-6 text-white" /></div>
              <span className="font-bold text-xl text-slate-900">DriveDeal</span>
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className={`p-2 rounded-xl ${step === 'otp' ? 'bg-[#3aab5c]' : 'bg-slate-200'} transition-colors`}>
                {step === 'details' ? <Car className="h-5 w-5 text-slate-600" /> : <KeyRound className="h-5 w-5 text-white" />}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">
                  {step === 'details' ? 'Create an account' : 'Verify your email'}
                </h1>
                <p className="text-slate-500 text-sm">
                  {step === 'details' ? 'Join DriveDeal to browse and contact our dealers' : `We sent a 6-digit code to ${formData.email}`}
                </p>
              </div>
            </div>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mt-4">
              <div className="h-1.5 flex-1 rounded-full bg-[#3aab5c]" />
              <div className={`h-1.5 flex-1 rounded-full ${step === 'otp' ? 'bg-[#3aab5c]' : 'bg-slate-200'} transition-colors`} />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {step === 'details' ? (
              <form className="space-y-4" onSubmit={requestOtp}>
                {[
                  { label: 'Full Name', name: 'fullName', type: 'text', icon: User, placeholder: 'John Doe' },
                  { label: 'Email Address', name: 'email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
                  { label: 'Phone Number', name: 'phone', type: 'tel', icon: Phone, placeholder: '+91 99999 99999' },
                ].map(({ label, name, type, icon: Icon, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <div className="relative">
                      <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type={type} name={name} required value={formData[name]} onChange={handleChange} disabled={isLoading} className={inputClass} placeholder={placeholder} />
                    </div>
                  </div>
                ))}
                {[
                  { label: 'Password', name: 'password', placeholder: '••••••••' },
                  { label: 'Confirm Password', name: 'confirmPassword', placeholder: '••••••••' },
                ].map(({ label, name, placeholder }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input type="password" name={name} required value={formData[name]} onChange={handleChange} disabled={isLoading} className={inputClass} placeholder={placeholder} />
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={isLoading} className="w-full bg-[#3aab5c] text-white hover:bg-[#2d8f4b] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-70 text-sm mt-2">
                  {isLoading ? 'Sending code...' : 'Continue →'}
                </button>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5 text-center">6-Digit Verification Code</label>
                  <input
                    type="text" maxLength={6} required value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    disabled={isLoading}
                    className="w-full text-center text-3xl tracking-[0.5em] bg-[#f5f7fa] border border-slate-200 rounded-xl py-4 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent disabled:opacity-70 font-mono"
                    placeholder="000000"
                  />
                </div>
                <button type="submit" disabled={isLoading || otp.length !== 6} className="w-full bg-[#3aab5c] text-white hover:bg-[#2d8f4b] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm disabled:opacity-50 text-sm">
                  {isLoading ? 'Registering...' : 'Verify & Create Account'}
                </button>
                <div className="text-center">
                  <button type="button" onClick={() => setStep('details')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-[#3aab5c] transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1.5" /> Change email address
                  </button>
                </div>
              </form>
            )}

            {step === 'details' && (
              <div className="mt-5 pt-5 border-t border-slate-100 text-center">
                <p className="text-sm text-slate-500">
                  Already have an account?{' '}
                  <Link href="/login" className="font-bold text-[#3aab5c] hover:text-[#2d8f4b]">Sign in</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

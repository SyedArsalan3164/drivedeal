"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Car, Facebook, Twitter, Instagram, Youtube, ArrowRight, Send } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

export const Footer = () => {
  const { role } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter your email address'); return; }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Subscription failed');
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#151c25] text-slate-400">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              <div className="p-1.5 rounded-lg bg-[#3aab5c]">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">DriveDeal</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-slate-400">
              Karnataka's most trusted platform for premium pre-owned vehicles. Verified listings, transparent pricing, and expert support.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, label: 'Facebook', href: '#' },
                { icon: Twitter, label: 'Twitter', href: '#' },
                { icon: Instagram, label: 'Instagram', href: '#' },
                { icon: Youtube, label: 'YouTube', href: '#' },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#3aab5c] flex items-center justify-center transition-all duration-200 group"
                >
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-[#3aab5c]/40">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', href: '/' },
                { label: 'Browse Vehicles', href: '/cars' },
                { label: 'Sign In', href: '/login' },
                { label: 'Create Account', href: '/signup' },
                ...(role === 'admin' ? [{ label: 'Admin Dashboard', href: '/admin/dashboard' }] : []),
              ].map(({ label, href }) => (
                <li key={label}>
                  <Link href={href} className="flex items-center gap-2 text-sm text-slate-400 hover:text-[#3aab5c] transition-colors group">
                    <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#3aab5c]" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-[#3aab5c]/40">
              Contact Us
            </h4>
            <ul className="space-y-4">
            
              <li className="flex items-start gap-3 text-sm">
                <Mail className="h-4 w-4 text-[#3aab5c] mt-0.5 flex-shrink-0" />
                <a href={`mailto:${process.env.NEXT_PUBLIC_DEALER_EMAIL || 'contact@drivedeal.com'}`} className="hover:text-white transition-colors break-all">
                  {process.env.NEXT_PUBLIC_DEALER_EMAIL || 'contact@drivedeal.com'}
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-4 w-4 text-[#3aab5c] mt-0.5 flex-shrink-0" />
                <span>Bangalore, Karnataka, India</span>
              </li>
              <li className="mt-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#3aab5c] bg-[#3aab5c]/10 px-3 py-1.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3aab5c] animate-pulse" />
                  Mon–Sat: 9AM – 8PM
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-5 pb-2 border-b border-[#3aab5c]/40">
              Stay Updated
            </h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Get the latest listings and exclusive deals delivered to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-[#3aab5c] hover:bg-[#2d8f4b] text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-70 shadow-sm"
              >
                <Send className="h-4 w-4" />
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} DriveDeal. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/login" className="hover:text-[#3aab5c] transition-colors">Privacy Policy</Link>
            <Link href="/login" className="hover:text-[#3aab5c] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

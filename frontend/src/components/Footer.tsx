"use client";
import React, { useState } from 'react';
import { Mail, Phone, MapPin, Car, Facebook, Twitter, Instagram } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../lib/AuthContext';
import toast from 'react-hot-toast';

export const Footer = () => {
  const { role } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/newsletter/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || 'Subscription failed');
      }
      
      toast.success(data.message || 'Subscribed successfully!');
      setEmail('');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">


          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-blue-600 text-white">
                <Car className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                DriveDeal
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              Your trusted partner in finding the perfect vehicle. We offer a premium selection of cars with transparent pricing and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>


          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li><Link href="/" className="text-slate-400 hover:text-blue-400 transition-colors">Home</Link></li>
              <li><Link href="/cars" className="text-slate-400 hover:text-blue-400 transition-colors">Inventory</Link></li>
              {!role && (
                <>
                  <li><Link href="/login" className="text-slate-400 hover:text-blue-400 transition-colors">Client Portal</Link></li>
                  <li><Link href="/signup" className="text-slate-400 hover:text-blue-400 transition-colors">Register</Link></li>
                </>
              )}
            </ul>
          </div>


          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                <span className="text-slate-400">Belur, Hassan<br />Karnataka, IN </span>
              </li>
              
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span className="text-slate-400">{process.env.NEXT_PUBLIC_DEALER_EMAIL || 'drivedealsa@gmail.com'}</span>
              </li>
            </ul>
          </div>


          <div>
            <h3 className="text-white font-bold text-lg mb-6">Newsletter</h3>
            <p className="text-slate-400 mb-4 text-sm">Subscribe to receive updates on new arrivals and special offers.</p>
            <form className="space-y-2" onSubmit={handleSubscribe}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full bg-slate-800 border border-slate-700 rounded-lg py-3 px-4 text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors text-sm"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium py-3 px-4 rounded-lg transition-colors text-sm disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} DriveDeal. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};



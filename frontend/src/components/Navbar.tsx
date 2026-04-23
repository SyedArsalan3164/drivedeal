"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, User, Car } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  const { role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isHome = pathname === '/';

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        setIsScrolled(window.scrollY > 10);
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      } ${
        isScrolled || !isHome ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className={`p-2 rounded-lg transition-colors ${isScrolled || !isHome ? 'bg-blue-600 text-white' : 'bg-white text-blue-600'}`}>
                <Car className="h-6 w-6" />
              </div>
              <span className={`font-bold text-xl tracking-tight ${isScrolled || !isHome ? 'text-slate-900' : 'text-black'}`}>
                DriveDeal
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              <Link href="/" className="font-medium transition-colors text-slate-600 hover:text-blue-600">Home</Link>
              <Link href="/cars" className="font-medium transition-colors text-slate-600 hover:text-blue-600">Collection</Link>

              {role === 'admin' && (
                <Link href="/admin/dashboard" className="font-medium text-slate-600 hover:text-blue-600 transition-colors">Dashboard</Link>
              )}

              {role ? (
                <button
                  onClick={handleLogout}
                  className="font-medium text-slate-600 hover:text-blue-600 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className={`flex items-center gap-2 font-medium px-5 py-2.5 rounded-lg transition-all ${
                    isScrolled || !isHome
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      : 'bg-white text-blue-600 hover:bg-slate-50 shadow-lg'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Client Portal
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${
                isScrolled || !isHome
                  ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  : 'text-black hover:bg-gray-200'
              }`}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 border-b border-slate-200' : 'max-h-0'} bg-white shadow-lg absolute w-full`}>
        <div className="px-4 pt-2 pb-6 space-y-1">
          <Link href="/" className="block text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-3 py-3 rounded-lg font-medium">Home</Link>
          <Link href="/cars" className="block text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-3 py-3 rounded-lg font-medium">Collection</Link>

          {role === 'admin' && (
            <Link href="/admin/dashboard" className="block text-blue-600 hover:bg-blue-50 px-3 py-3 rounded-lg font-medium">Dashboard</Link>
          )}

          <div className="pt-4 mt-2 border-t border-slate-100">
            {role ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-3 py-3 rounded-lg font-medium"
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="flex items-center gap-2 w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium justify-center mt-2">
                <User className="h-4 w-4" />
                Client Portal
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Car, User, LogOut, LayoutDashboard } from 'lucide-react';
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

  const navBg = isScrolled || !isHome ? 'bg-white shadow-md' : 'bg-[#151c25]';
  const linkColor = isScrolled || !isHome ? 'text-slate-700 hover:text-[#3aab5c]' : 'text-slate-200 hover:text-white';
  const logoTextColor = isScrolled || !isHome ? 'text-slate-900' : 'text-white';

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed w-full z-40 top-0 transition-all duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="p-1.5 rounded-lg bg-[#3aab5c] text-white">
                <Car className="h-5 w-5" />
              </div>
              <span className={`font-bold text-xl tracking-tight transition-colors ${logoTextColor}`}>
                DriveDeal
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-7">
              <Link href="/" className={`text-sm font-medium transition-colors ${linkColor}`}>Home</Link>
              <Link href="/cars" className={`text-sm font-medium transition-colors ${linkColor}`}>Vehicles</Link>

              {role === 'admin' && (
                <Link href="/admin/dashboard" className={`text-sm font-medium transition-colors ${linkColor}`}>
                  Dashboard
                </Link>
              )}

              {role ? (
                <button
                  onClick={handleLogout}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${linkColor}`}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:border-[#3aab5c] hover:text-[#3aab5c] transition-all bg-white"
                >
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}


            </div>

            {/* Mobile Hamburger */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-md focus:outline-none ${isScrolled || !isHome ? 'text-slate-700 hover:bg-slate-100' : 'text-white hover:bg-white/10'}`}
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 border-b border-slate-200' : 'max-h-0'} bg-white shadow-lg absolute w-full`}>
          <div className="px-4 pt-2 pb-6 space-y-1">
            <Link href="/" className="block text-slate-700 hover:text-[#3aab5c] hover:bg-slate-50 px-3 py-3 rounded-lg text-sm font-medium">Home</Link>
            <Link href="/cars" className="block text-slate-700 hover:text-[#3aab5c] hover:bg-slate-50 px-3 py-3 rounded-lg text-sm font-medium">Vehicles</Link>

            {role === 'admin' && (
              <Link href="/admin/dashboard" className="flex items-center gap-2 text-[#3aab5c] hover:bg-green-50 px-3 py-3 rounded-lg text-sm font-medium">
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
            )}

            <div className="pt-4 mt-2 border-t border-slate-100 space-y-2">
              {role ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left text-slate-700 hover:text-slate-900 hover:bg-slate-50 px-3 py-3 rounded-lg text-sm font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              ) : (
                <Link href="/login" className="flex items-center gap-2 w-full border border-slate-200 text-slate-700 px-4 py-3 rounded-lg text-sm font-medium justify-center hover:border-[#3aab5c] hover:text-[#3aab5c] transition-all">
                  <User className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

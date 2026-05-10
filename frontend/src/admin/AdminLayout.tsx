"use client";
import React from 'react';
import { useAuth } from '../lib/AuthContext';
import { LayoutDashboard, Car, PlusCircle, Users, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

export const AdminLayout = ({ children }: { children?: React.ReactNode }) => {
  const { role, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  if (role !== 'admin') {
    return (
      <div className="min-h-screen bg-[#f5f7fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Unauthorized Access</h2>
          <p className="text-slate-500 text-sm mb-4">Please login as an admin to access this page.</p>
          <Link href="/login" className="inline-flex items-center gap-2 bg-[#3aab5c] text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#2d8f4b] transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => { logout(); router.push('/login'); };

  const navItems = [
    { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/manage', icon: Car, label: 'Manage Cars' },
    { href: '/admin/add-car', icon: PlusCircle, label: 'Add New Car' },
    { href: '/admin/requests', icon: Users, label: 'Client Inquiries' },
  ];

  return (
    <div className="flex min-h-screen bg-[#f5f7fa]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151c25] text-slate-300 flex flex-col fixed h-full z-20">
        <div className="p-6 border-b border-[#1e2836]">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-[#3aab5c]">
              <Car className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white">DriveDeal</span>
          </Link>
          <div className="mt-1.5 text-xs font-semibold text-[#3aab5c] uppercase tracking-wider">Admin Portal</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                  isActive
                    ? 'bg-[#3aab5c] text-white shadow-sm'
                    : 'text-slate-400 hover:bg-[#1e2836] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" style={{ height: '18px', width: '18px' }} />
                  {label}
                </div>
                {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#1e2836]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-xl text-red-400 hover:bg-[#1e2836] hover:text-red-300 transition-all text-sm font-medium"
          >
            <LogOut className="h-4.5 w-4.5 flex-shrink-0" style={{ height: '18px', width: '18px' }} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 bg-[#f5f7fa] min-h-screen">
        {children}
      </main>
    </div>
  );
};

"use client";

import React from 'react';
import { Toaster } from 'react-hot-toast';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from '../lib/AuthContext';
import { DataProvider } from '../lib/DataContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { GoToTop } from './GoToTop';

export const ClientProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" />
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
            <GoToTop />
          </div>
        </DataProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

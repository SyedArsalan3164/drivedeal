import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Home } from '../pages/Home';
import { Login } from '../pages/Login';
import { Signup } from '../pages/Signup';
import { ForgotPassword } from '../pages/ForgotPassword';
import { ResetPassword } from '../pages/ResetPassword';
import { CarsList } from '../pages/CarsList';
import { CarDetails } from '../pages/CarDetails';
import { AdminLayout } from '../admin/AdminLayout';
import { AdminDashboard } from '../admin/AdminDashboard';
import { ManageCars } from '../admin/ManageCars';
import { AddCar } from '../admin/AddCar';
import { ClientRequests } from '../admin/ClientRequests';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../pages/AuthContext';
import { DataProvider } from '../pages/DataContext';
import { GoToTop } from '../components/GoToTop';

const Layout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
    <GoToTop />
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Toaster position="top-right" />
          <Routes>
         
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
          <Route path="/reset-password/:resetToken" element={<Layout><ResetPassword /></Layout>} />
          <Route path="/cars" element={<Layout><CarsList /></Layout>} />
          <Route path="/car/:id" element={<Layout><CarDetails /></Layout>} />

          
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/manage" element={<ManageCars />} />
            <Route path="/admin/add-car" element={<AddCar />} />
            <Route path="/admin/requests" element={<ClientRequests />} />
          </Route>

          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

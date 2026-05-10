"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext';
import { MapPin, Calendar, Gauge, Fuel, Settings, ArrowLeft, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

export const CarDetails = () => {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const { role, user } = useAuth();
  const { cars, addRequest } = useData();

  const [car, setCar] = useState(cars.find(c => c.id === id));
  const [activeImage, setActiveImage] = useState(0);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    message: '',
    visitDate: ''
  });

  useEffect(() => {
    if (!car) { router.push('/cars'); }
  }, [car, router]);

  if (!car) return null;

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error('Please login to contact the dealer');
      router.push('/login');
      return;
    }
    if (!formData.name || !formData.phone || !formData.message || !formData.visitDate) {
      toast.error('Please fill in all fields');
      return;
    }
    addRequest({
      clientName: formData.name,
      phone: formData.phone,
      carId: car.id,
      visitDate: formData.visitDate,
      message: formData.message
    });
    toast.success('Dealer contacted successfully!');
    setFormData({ ...formData, message: '', visitDate: '' });
  };

  const handleCallDealer = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!role) {
      toast.error('Please login to call the dealer');
      router.push('/login');
      return;
    }
    const phone = process.env.NEXT_PUBLIC_DEALER_PHONE;
    window.location.href = `tel:${phone}`;
  };

  const inputClass = "w-full bg-[#f5f7fa] border border-slate-200 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent text-sm transition-all";

  return (
    <div className="min-h-screen bg-[#f5f7fa] pt-20 pb-20">
      {/* Page header bar */}
      <div className="bg-[#151c25] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors text-sm font-medium"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Collection
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-white text-sm font-semibold">{car.brand} {car.model}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left — Images + Details */}
          <div className="lg:w-2/3 space-y-6">
            {/* Main image */}
            <div className="relative h-[380px] md:h-[480px] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
              <img
                src={car.images?.[activeImage] || 'https://picsum.photos/seed/car/800/600'}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
              {car.status === 'Sold' && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <span className="bg-white text-slate-900 px-6 py-2.5 rounded-lg font-bold tracking-widest uppercase shadow-lg text-lg">SOLD</span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {(car.images?.length || 0) > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {car.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${activeImage === idx ? 'border-[#3aab5c] shadow-sm' : 'border-transparent opacity-60 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Car details card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <p className="text-[#3aab5c] text-sm font-semibold mb-1">{car.year}</p>
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{car.brand} {car.model}</h1>
                  <p className="text-slate-500 flex items-center gap-1.5 mt-2 text-sm font-medium">
                    <MapPin className="h-4 w-4 text-[#3aab5c]" /> {car.location}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Asking Price</div>
                  <div className="text-3xl font-extrabold text-[#3aab5c]">₹{(car.price || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>

              {/* Specs grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 py-6 border-y border-slate-100 mb-8">
                {[
                  { icon: Calendar, label: 'Year', value: car.year },
                  { icon: Gauge, label: 'Mileage', value: `${(car.mileage || 0).toLocaleString('en-IN')} km` },
                  { icon: Fuel, label: 'Fuel', value: car.fuelType },
                  { icon: Settings, label: 'Trans.', value: car.transmission },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex flex-col items-center justify-center p-4 bg-[#f5f7fa] rounded-xl border border-slate-100">
                    <Icon className="h-5 w-5 text-[#3aab5c] mb-2" />
                    <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">{label}</span>
                    <span className="font-bold text-slate-900 text-sm">{value}</span>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Vehicle Description</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{car.description}</p>
              </div>


            </div>
          </div>

          {/* Right — Contact Form */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-7 border border-slate-200 shadow-sm sticky top-24">
              <h3 className="text-xl font-bold text-slate-900 mb-1">Contact Dealer</h3>
              <p className="text-slate-500 text-sm mb-6">Fill in your details and we'll get back to you shortly.</p>

              {car.status === 'Sold' ? (
                <div className="bg-slate-100 border border-slate-200 text-slate-500 p-6 rounded-xl text-center text-sm font-medium">
                  This vehicle has been sold.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  {[
                    { label: 'Your Name', field: 'name', type: 'text', placeholder: 'Full name' },
                    { label: 'Phone Number', field: 'phone', type: 'tel', placeholder: 'Your phone' },
                  ].map(({ label, field, type, placeholder }) => (
                    <div key={field}>
                      <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">{label}</label>
                      <input
                        type={type}
                        value={formData[field]}
                        onChange={e => setFormData({ ...formData, [field]: e.target.value })}
                        className={inputClass}
                        placeholder={placeholder}
                      />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Preferred Visit Date</label>
                    <input
                      type="date"
                      value={formData.visitDate}
                      onChange={e => setFormData({ ...formData, visitDate: e.target.value })}
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Message</label>
                    <textarea
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      rows={3}
                      className={`${inputClass} resize-none`}
                      placeholder="I'm interested in this vehicle..."
                    />
                  </div>
                  <div className="flex flex-col gap-2.5 pt-1">
                    <button type="submit" className="w-full bg-[#3aab5c] text-white hover:bg-[#2d8f4b] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-sm">
                      Send Inquiry
                    </button>
                    <button
                      type="button"
                      onClick={handleCallDealer}
                      className="w-full flex justify-center items-center gap-2 bg-[#151c25] text-white hover:bg-[#1e2836] font-bold py-3 px-6 rounded-xl transition-colors shadow-sm text-sm"
                    >
                      <Phone className="h-4 w-4" /> Call Dealer
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

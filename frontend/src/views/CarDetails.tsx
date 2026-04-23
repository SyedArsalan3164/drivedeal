"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext';
import { MapPin, Calendar, Gauge, Fuel, Settings, ArrowLeft, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

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
    if (!car) {
      router.push('/cars');
    }
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

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 mb-8 font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Collection
        </button>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-2/3 space-y-8">
            <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm">
              <img 
                src={car.images?.[activeImage] || 'https://picsum.photos/seed/car/800/600'} 
                alt={`${car.brand} ${car.model}`} 
                className="w-full h-full object-cover transition-opacity duration-500"
                referrerPolicy="no-referrer"
              />
            </div>

            {(car.images?.length || 0) > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {car.images?.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`relative flex-shrink-0 w-24 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === idx ? 'border-blue-600 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
                <div>
                  <div className="text-blue-600 font-semibold mb-2">{car.year}</div>
                  <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">{car.brand} {car.model}</h1>
                  <p className="text-slate-500 flex items-center gap-2 font-medium">
                    <MapPin className="h-4 w-4 text-slate-400" /> {car.location}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-slate-500 text-sm font-medium mb-1 uppercase tracking-wider">Asking Price</div>
                  <div className="text-4xl font-bold text-blue-600">₹{(car.price || 0).toLocaleString()}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8 border-y border-slate-100 mb-8">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Calendar className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Year</span>
                  <span className="font-bold text-slate-900">{car.year}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Gauge className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Mileage</span>
                  <span className="font-bold text-slate-900">{(car.mileage || 0).toLocaleString()} km/l</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Fuel className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Fuel</span>
                  <span className="font-bold text-slate-900">{car.fuelType}</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <Settings className="h-6 w-6 text-slate-400 mb-2" />
                  <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Trans</span>
                  <span className="font-bold text-slate-900">{car.transmission}</span>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Vehicle Description</h3>
                <p className="text-slate-600 leading-relaxed">{car.description}</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm sticky top-28">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Contact Dealer</h3>
              
              {car.status === 'Sold' ? (
                <div className="bg-slate-100 border border-slate-200 text-slate-600 p-6 rounded-xl text-center font-medium">
                  This vehicle has been sold.
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Phone</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Preferred Viewing Date</label>
                    <input 
                      type="date" 
                      value={formData.visitDate}
                      onChange={e => setFormData({...formData, visitDate: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Message</label>
                    <textarea 
                      value={formData.message}
                      onChange={e => setFormData({...formData, message: e.target.value})}
                      rows={4}
                      className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="I'm interested in this vehicle..."
                    ></textarea>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    <button 
                      type="submit"
                      className="flex-1 bg-blue-600 text-white hover:bg-blue-700 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm"
                    >
                      Send Inquiry
                    </button>
                    <button 
                      type="button"
                      onClick={handleCallDealer}
                      className="flex-1 flex justify-center items-center bg-slate-800 text-white hover:bg-slate-900 font-bold py-3.5 px-6 rounded-xl transition-colors shadow-sm text-center"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      Call
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



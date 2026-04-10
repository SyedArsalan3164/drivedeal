import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Clock, Award, Search, SlidersHorizontal, Car } from 'lucide-react';
import { useData } from './DataContext';
import { useAuth } from './AuthContext';
import { CarCard } from '../components/CarCard';

export const Home = () => {
  const { cars } = useData();
  const { role } = useAuth();
  const featuredCars = cars.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2940&auto=format&fit=crop" 
            alt="Modern Cars" 
            className="w-full h-full object-cover opacity-10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-50/80 via-slate-50/95 to-slate-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-8 border border-blue-100">
            <Award className="h-4 w-4" />
            <span>Premium Dealership Experience</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight mb-6">
            Find Your Next <br className="hidden md:block" />
            <span className="text-blue-600">Perfect Drive</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Browse our extensive collection of verified, high-quality vehicles. We make finding and purchasing your next car simple, transparent, and enjoyable.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              to="/cars" 
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-medium transition-all hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5"
            >
              <Search className="h-5 w-5" />
              Browse Inventory
            </Link>
            {!role && (
              <Link 
                to="/login" 
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-medium transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                Sign In / Register
              </Link>
            )}
          </div>
          
          
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto border-t border-slate-200 pt-10">
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">500+</div>
              <div className="text-sm font-medium text-slate-500">Vehicles Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">98%</div>
              <div className="text-sm font-medium text-slate-500">Happy Clients</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">150+</div>
              <div className="text-sm font-medium text-slate-500">Cars in Stock</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-slate-900 mb-1">24/7</div>
              <div className="text-sm font-medium text-slate-500">Support</div>
            </div>
          </div>
        </div>
      </section>

      
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Featured Vehicles</h2>
              <p className="text-slate-600 max-w-2xl">Hand-picked selection of our most popular and highly-rated cars currently available in our showroom.</p>
            </div>
            <Link to="/cars" className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-700 transition-colors group whitespace-nowrap">
              View All Inventory <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <Car className="h-12 w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Inventory Updating</h3>
              <p className="text-slate-500 max-w-md mx-auto">We are currently updating our featured collection. Please check back shortly.</p>
            </div>
          )}
        </div>
      </section>
      
      
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Why Choose DriveDeal</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We provide a seamless, transparent, and secure car buying experience designed around your needs.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Verified Quality</h3>
              <p className="text-slate-600 leading-relaxed">Every vehicle undergoes a comprehensive 150-point inspection by certified mechanics before listing.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center mb-6">
                <SlidersHorizontal className="h-7 w-7 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Transparent Pricing</h3>
              <p className="text-slate-600 leading-relaxed">No hidden fees or surprise charges. The price you see is the price you pay, with clear financing options.</p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-50 rounded-xl flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Save Time</h3>
              <p className="text-slate-600 leading-relaxed">Complete most of your purchase online. Schedule a test drive or have the car delivered directly to you.</p>
            </div>
          </div>
        </div>
      </section>
      
      
      {!role && (
        <section className="py-20 bg-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to find your dream car?</h2>
            <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">Join thousands of satisfied customers who found their perfect vehicle through DriveDeal.</p>
            <Link 
              to="/signup" 
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-xl font-bold transition-all hover:bg-blue-50 hover:shadow-lg hover:-translate-y-0.5"
            >
              Create an Account
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

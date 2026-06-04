"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ShieldCheck, Clock, Award, Search,
  SlidersHorizontal, Car, MapPin, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useData } from '../lib/DataContext';
import { useAuth } from '../lib/AuthContext';
import { CarCard } from '../components/CarCard';

const BRANDS = [
  { name: 'Maruti', abbr: 'MS' },
  { name: 'Hyundai', abbr: 'HY' },
  { name: 'Tata', abbr: 'TA' },
  { name: 'Honda', abbr: 'HN' },
  { name: 'Toyota', abbr: 'TY' },
  { name: 'Mahindra', abbr: 'MH' },
  { name: 'Kia', abbr: 'KI' },
  { name: 'Ford', abbr: 'FD' },
];

export const Home = ({ initialCars = [] }: { initialCars?: any[] }) => {
  const { cars: contextCars } = useData();
  const cars = initialCars.length > 0 ? initialCars : contextCars;
  const { role } = useAuth();
  const featuredCars = cars.slice(0, 6);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/cars?search=${encodeURIComponent(searchQuery)}`;
    } else {
      window.location.href = '/cars';
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f7fa]">

      {/* ===== HERO ===== */}
      <section className="hero-section" style={{ minHeight: '520px', paddingTop: '64px' }}>
        <div className="absolute inset-0 bg-[#151c25]" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, #3aab5c 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10" style={{
          background: 'radial-gradient(ellipse at right center, #3aab5c 0%, transparent 70%)'
        }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Mobile: center, Desktop: left-align */}
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <p className="text-[#3aab5c] font-semibold text-xs sm:text-sm uppercase tracking-widest mb-3">
              Find Your Perfect Car
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-5" style={{ lineHeight: 1.15 }}>
              Looking for a vehicle?<br />
              <span className="text-white">You're in the </span>
              <span className="text-[#3aab5c]">perfect spot.</span>
            </h1>

            {/* Badges — centered on mobile */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-3 mt-4">
              {['High quality at a low cost', 'Premium services', 'Regular Updates'].map(text => (
                <div key={text} className="hero-badge">
                  <CheckCircle2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== SEARCH BAR ===== */}
      <section className="relative z-20 -mt-8 sm:-mt-10 pb-0">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="search-bar">
            <div className="flex flex-col gap-3">

              {/* Inputs row */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Vehicle */}
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block text-center sm:text-left">
                    Search Vehicle
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Brand, model, location..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleSearch()}
                      className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="flex-1 min-w-0">
                  <label className="text-xs text-slate-500 font-medium mb-1.5 block text-center sm:text-left">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Karnataka, India"
                      className="pl-10 pr-4 py-3 w-full border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3aab5c] focus:border-transparent transition-all"
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Search Button — full width on mobile */}
              <button
                onClick={handleSearch}
                className="btn-primary w-full sm:w-auto sm:self-end px-6 py-3 rounded-lg text-sm justify-center"
              >
                <Search className="h-4 w-4" />
                Find a Vehicle
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== STATS BAR ===== */}
      <section className="py-8 sm:py-10 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
            {[
              { value: `${cars.length}+`, label: 'Vehicles Listed' },
              { value: 'On-Spot', label: 'Point Inspection' },
              { value: '100%', label: 'Transparent Pricing' },
              { value: 'Constant', label: 'Support Available' },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center py-2">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#3aab5c]">{stat.value}</span>
                <span className="text-slate-500 text-xs sm:text-sm mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PREMIUM BRANDS ===== */}
      <section className="py-10 sm:py-14 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header: stacks on mobile */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6 sm:mb-8 text-center sm:text-left">
            <div>
              <h2 className="section-title">Premium Brands</h2>
              <p className="section-subtitle">Unveil the finest selection of high-end vehicles</p>
            </div>
            <Link href="/cars" className="flex items-center justify-center sm:justify-start gap-1 text-sm text-[#3aab5c] font-semibold hover:text-[#2d8f4b] transition-colors whitespace-nowrap">
              Show All Brands <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Brand grid — 4 cols on mobile, 8 on desktop */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 sm:gap-3">
            {BRANDS.map((brand) => (
              <Link key={brand.name} href={`/cars?search=${brand.name}`}
                className="brand-logo flex-col gap-1.5 py-3 px-1 rounded-xl hover:bg-white hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700 mx-auto">
                  {brand.abbr}
                </div>
                {/* Show name on all screen sizes */}
                <span className="text-[10px] sm:text-xs text-slate-600 font-medium text-center block">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== MOST SEARCHED / FEATURED VEHICLES ===== */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8 sm:mb-10 text-center sm:text-left">
            <div>
              <h2 className="section-title">Most Searched Vehicles</h2>
              <p className="section-subtitle">Browse our top picks from premium brands</p>
            </div>
            <Link href="/cars" className="flex items-center justify-center sm:justify-start gap-1 text-sm text-[#3aab5c] font-semibold hover:text-[#2d8f4b] transition-colors whitespace-nowrap">
              View All Inventory <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {featuredCars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                {featuredCars.map(car => (
                  <CarCard key={car.id} car={car} />
                ))}
              </div>
              <div className="flex justify-center mt-8 sm:mt-10">
                <Link href="/cars" className="btn-primary px-6 sm:px-8 py-3 sm:py-3.5 rounded-lg text-sm w-full sm:w-auto justify-center">
                  Load More Cars
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 sm:py-20 bg-slate-50 rounded-2xl border border-slate-200">
              <Car className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">Inventory Updating</h3>
              <p className="text-slate-500 max-w-sm mx-auto text-sm px-4">Please wait while we refresh our featured collection.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className="py-12 sm:py-16 bg-[#f5f7fa]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="section-title">Why Choose DriveDeal</h2>
            <p className="section-subtitle max-w-xl mx-auto px-2">
              We provide the most trusted second-hand car buying experience in India, designed with transparency and security at its core.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: <ShieldCheck className="h-7 w-7 text-[#3aab5c]" />,
                bg: 'bg-[#e8f8ee]',
                title: 'Verified Quality',
                desc: 'Every vehicle undergoes a comprehensive 150-point inspection by certified mechanics before listing.'
              },
              {
                icon: <SlidersHorizontal className="h-7 w-7 text-blue-600" />,
                bg: 'bg-blue-50',
                title: 'Transparent Pricing',
                desc: 'No hidden fees or surprise charges. The price you see is the price you pay, with clear financing options.'
              },
              {
                icon: <Clock className="h-7 w-7 text-purple-600" />,
                bg: 'bg-purple-50',
                title: 'Save Time',
                desc: 'Complete most of your purchase online. Schedule a test drive or have the car delivered directly to you.'
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group text-center sm:text-left">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${item.bg} rounded-xl flex items-center justify-center mb-5 sm:mb-6 group-hover:scale-110 transition-transform mx-auto sm:mx-0`}>
                  {item.icon}
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 sm:mb-3">{item.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA (only for guests) ===== */}
      {!role && (
        <section className="py-14 sm:py-20 bg-[#151c25] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3aab5c]/20 text-[#3aab5c] text-xs sm:text-sm font-semibold mb-5 sm:mb-6">
              <Award className="h-4 w-4" />
              Premium Dealership Experience
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">Ready to find your dream car?</h2>
            <p className="text-slate-400 text-sm sm:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
              Join thousands of satisfied customers who found their perfect vehicle through DriveDeal.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-[#3aab5c] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl font-bold transition-all hover:bg-[#2d8f4b] hover:shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Create an Account
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

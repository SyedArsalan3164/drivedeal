import React from 'react';
import { CarDetails } from '../../../views/CarDetails';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const res = await fetch(`${API_URL}/cars`, { cache: 'no-store' });
    const cars = await res.json();
    const car = cars.find((c: any) => c._id === id);
    if (!car) return { title: 'Car Not Found - DriveDeal' };
    return {
      title: `Used ${car.brand} ${car.model} ${car.year} For Sale | DriveDeal`,
      description: car.description || `Buy verified second hand ${car.brand} ${car.model} (${car.year}) for ₹${(car.price || 0).toLocaleString()} at DriveDeal. Best deals on used cars in Karnataka and India.`,
      keywords: [`used ${car.brand} ${car.model}`, `second hand ${car.brand} ${car.model}`, `buy ${car.brand} ${car.model} ${car.year}`, 'used cars in karnataka'],
      openGraph: {
        title: `Second Hand ${car.brand} ${car.model} (${car.year}) - DriveDeal`,
        description: car.description || `High-quality ${car.brand} ${car.model} available at DriveDeal.`,
        url: `https://www.drivedeal.tech/car/${id}`,
        images: car.images?.length ? [{ url: car.images[0] }] : [],
      },
    };
  } catch {
    return { title: 'Car Details - DriveDeal' };
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let car: any = null;
  try {
    const res = await fetch(`${API_URL}/cars`, { cache: 'no-store' });
    const cars = await res.json();
    car = cars.find((c: any) => c._id === id);
  } catch (error) {
    console.error('Error fetching car for JSON-LD:', error);
  }

  const jsonLd = car ? {
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${car.brand} ${car.model} (${car.year})`,
    description: car.description,
    image: car.images?.[0],
    brand: {
      '@type': 'Brand',
      name: car.brand
    },
    model: car.model,
    modelDate: car.year,
    offers: {
      '@type': 'Offer',
      price: car.price,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      url: `https://www.drivedeal.tech/car/${id}`
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <CarDetails />
    </>
  );
}

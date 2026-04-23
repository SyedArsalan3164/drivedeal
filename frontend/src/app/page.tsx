import { Home } from '../views/Home';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function Page() {
  let initialCars = [];
  try {
    const res = await fetch(`${API_URL}/cars`, { cache: 'no-store' });
    const data = await res.json();
    initialCars = Array.isArray(data) ? data.map((car: any) => ({ ...car, id: car._id })) : [];
  } catch (error) {
    console.error('Error fetching cars for Home SSR:', error);
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'DriveDeal',
    image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1200',
    '@id': 'https://www.drivedeal.tech',
    url: 'https://www.drivedeal.tech',
    telephone: '+919448220323',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Road',
      addressLocality: 'Bangalore',
      addressRegion: 'Karnataka',
      postalCode: '560001',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 12.9716,
      longitude: 77.5946,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '20:00'
    },
    sameAs: [
      'https://facebook.com/drivedeal',
      'https://instagram.com/drivedeal'
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Home initialCars={initialCars} />
    </>
  );
}

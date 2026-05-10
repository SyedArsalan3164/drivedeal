import { Home } from '../views/Home';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://drivedeal-backend-api.onrender.com/api';

export default async function Page() {
  // Fetch cars server-side for JSON-LD structured data (SEO only, not passed to client)
  let cars: any[] = [];
  try {
    const res = await fetch(`${API_URL}/cars`, { next: { revalidate: 3600 } });
    const data = await res.json();
    cars = Array.isArray(data) ? data.map((car: any) => ({ ...car, id: car._id })) : [];
  } catch (error) {
    console.error('Error fetching cars for SEO:', error);
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
      dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
      opens: '09:00',
      closes: '20:00'
    },
    sameAs: [
      'https://facebook.com/drivedeal',
      'https://instagram.com/drivedeal'
    ]
  };

  // Build ItemList schema for car listings (SEO rich results)
  const carsJsonLd = cars.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: cars.slice(0, 10).map((car: any, index: number) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Car',
        name: `${car.brand} ${car.model} ${car.year}`,
        description: car.description || `Used ${car.brand} ${car.model} ${car.year} for sale`,
        url: `https://www.drivedeal.tech/car/${car.id}`,
        vehicleModelDate: String(car.year),
        offers: {
          '@type': 'Offer',
          price: car.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock'
        }
      }
    }))
  } : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {carsJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(carsJsonLd) }}
        />
      )}
      <Home />
    </>
  );
}

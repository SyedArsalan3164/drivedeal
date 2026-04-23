import { MetadataRoute } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BASE_URL = 'https://www.drivedeal.tech';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const routes = [
    '',
    '/cars',
    '/login',
    '/signup',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic car routes
  let carRoutes: any[] = [];
  try {
    const res = await fetch(`${API_URL}/cars`, { cache: 'no-store' });
    const cars = await res.json();
    carRoutes = cars.map((car: any) => ({
      url: `${BASE_URL}/car/${car._id}`,
      lastModified: new Date(car.updatedAt || new Date()),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error fetching cars for sitemap:', error);
  }

  return [...routes, ...carRoutes];
}

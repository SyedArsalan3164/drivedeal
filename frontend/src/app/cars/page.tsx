import { CarsList } from '../../views/CarsList';

export const metadata = {
  title: 'Used Cars in Karnataka & India - Browse Inventory',
  description: 'Explore our complete inventory of premium second-hand cars in Karnataka. Verified vehicles at the best prices in India.',
  keywords: ['used cars inventory', 'second hand cars list', 'buy used cars Karnataka', 'pre-owned cars India'],
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default async function Page() {
  let initialCars = [];
  try {
    const res = await fetch(`${API_URL}/cars`, { cache: 'no-store' });
    initialCars = await res.json();
  } catch (error) {
    console.error('Error fetching cars for SSR:', error);
  }

  return <CarsList initialCars={initialCars} />;
}

"use client";
import React, { useEffect, useState } from 'react';
import AlbumCover from '../components/AlbumCover';
import TopSupporters from '../components/TopSupporters';
import PurchaseForm from '../components/PurchaseForm';

interface Supporter {
  name: string;
  instagram: string;
  amount: number;
  currency: 'USD' | 'IRR';
}

const Home: React.FC = () => {
  const [topSupportersUSD, setTopSupportersUSD] = useState<Supporter[]>([]);
  const [topSupportersIRR, setTopSupportersIRR] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const response = await fetch('/api/top-users');
        if (!response.ok) {
          throw new Error('Failed to fetch supporters');
        }
        const data = await response.json();
        setTopSupportersUSD(data.usd);
        setTopSupportersIRR(data.irr);
      } catch (err) {
        setError('خطا در دریافت اطلاعات');
        console.error('Error fetching supporters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupporters();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#b62c2c]">
        <div className="text-white">در حال بارگذاری...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#b62c2c]">
        <div className="text-white">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#b62c2c] p-4">
      <div className="mb-0">
        <AlbumCover
          coverUrl="/album-cover.png"
          albumName="GHEDDIS (ALBUM)"
          artistName="VINAK"
        />
      </div>

      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-4" dir="rtl">
        <div className="w-full md:w-1/3 md:min-w-[400px] px-0 sm:px-2 order-3 md:order-1">
          <PurchaseForm />
        </div>

        <div className="w-full md:w-1/3 md:min-w-[400px] px-0 sm:px-2 order-1 md:order-2">
          <TopSupporters
            supporters={topSupportersUSD}
            title="۵ خریدار برتر (دلاری)"
          />
        </div>

        <div className="w-full md:w-1/3 md:min-w-[400px] px-0 sm:px-2 order-2 md:order-3">
          <TopSupporters
            supporters={topSupportersIRR}
            title="۵ خریدار برتر (تومانی)"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
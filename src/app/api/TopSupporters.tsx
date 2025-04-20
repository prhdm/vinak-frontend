"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Supporter } from "@/types/supporter";

interface TopSupportersProps {
  title?: string;
}

const TopSupporters: React.FC<TopSupportersProps> = ({ title }) => {
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const response = await fetch('/api/v1/top-users', {
          cache: 'no-store'
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch supporters');
        }
        
        const data = await response.json();
        if (!data || !Array.isArray(data.top_users)) {
          throw new Error('Invalid data format received from API');
        }
        
        setSupporters(data.top_users);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load supporters';
        setError(errorMessage);
        console.error('Error fetching supporters:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupporters();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-[95vw] mx-auto bg-neutral-900 text-neutral-100 p-6 sm:p-10 px-4 sm:px-6 rounded-3xl border border-neutral-800 flex justify-center items-center h-64">
        <div className="animate-pulse text-neutral-400">Loading supporters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-[95vw] mx-auto bg-neutral-900 text-neutral-100 p-6 sm:p-10 px-4 sm:px-6 rounded-3xl border border-neutral-800 text-center text-red-500">
        {error}
      </div>
    );
  }

  const sortedSupporters = supporters.slice().sort((a, b) => b.total_amount - a.total_amount);

  return (
    <div
      dir="rtl"
      className="w-full max-w-[95vw] mx-auto bg-neutral-900 text-neutral-100 p-6 sm:p-10 px-4 sm:px-6 rounded-3xl border border-neutral-800 transition-all duration-300 font-iranyekan shadow-lg"
    >
      {title && ( 
        <h2 className="mb-8 text-2xl md:text-2xl text-center">
          {title}
        </h2>
      )}
      <ul className="space-y-4 sm:space-y-6">
        {sortedSupporters.map((supporter, index) => (
          <li
            key={index}
            dir="ltr"
            className={`flex items-center justify-between p-4 sm:p-4 rounded-xl border transition duration-200 ${
              index === 0
                ? 'bg-gradient-to-r from-[#8B0000] to-[#8B0000] border-[#8B0000]'
                : index === 1
                ? 'bg-gradient-to-r from-[#8B0000] to-[#8B0000] border-[#8B0000]'
                : index === 2
                ? 'bg-gradient-to-r from-[#8B0000] to-[#8B0000] border-[#8B0000]'
                : 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700'
            }`}
          >
            <div className="flex items-center gap-4 sm:gap-4">
              {index < 3 ? (
                <Image 
                  src={`/icons/medal-${index + 1}.png`} 
                  alt={`Medal ${index + 1}`}
                  width={24}
                  height={24}
                  className="object-contain"
                />
              ) : (
                <span className="text-lg sm:text-base font-bold text-neutral-100 font-sf">{index + 1}</span>
              )}
              <div className="flex flex-col text-left">
                <span className={`text-lg sm:text-base font-bold ${
                  index < 3 ? 'text-white' : 'text-neutral-100'
                } font-sf`}>{supporter.name}</span>
                <a
                  href={`https://instagram.com/${supporter.instagram_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-sm sm:text-xs ${
                    index < 3 ? 'text-white/80 hover:text-white' : 'text-neutral-400 hover:text-neutral-100'
                  } transition-colors font-sf`}
                  dir="ltr"
                >
                  @{supporter.instagram_id}
                </a>
              </div>
            </div>
            <div className="text-left">
              <p className={`text-xl sm:text-lg font-bold ${
                index < 3 ? 'text-white' : 'text-neutral-100'
              } font-sf`}>
                {'$'}
                {Math.round(supporter.total_amount).toLocaleString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSupporters;
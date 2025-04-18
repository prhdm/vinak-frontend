import React from 'react';

interface Supporter {
  name: string;
  instagram: string;
  amount: number;
  currency: 'USD' | 'IRR';
}

interface TopSupportersProps {
  supporters: Supporter[];
  title?: string;
}

const TopSupporters: React.FC<TopSupportersProps> = ({ supporters = [], title }) => {
  const sortedSupporters = supporters.slice().sort((a, b) => b.amount - a.amount);

  return (
    <div
      dir="rtl"
      className="w-full bg-neutral-900 p-8 px-6 rounded-3xl border border-neutral-700 transition-all duration-300 font-iranyekan"
          >
      {title && (
        <h2 className="mb-8 text-2xl md:text-2xl text-white text-center">
          {title}
        </h2>
      )}
      <ul className="space-y-6">
        {sortedSupporters.map((supporter, index) => (
          <li
            key={index}
            dir="ltr"
            className="flex items-center justify-between p-4 bg-neutral-800 rounded-xl border border-neutral-700 hover:bg-neutral-700 transition duration-200"
          >
            <div className="flex flex-col text-left">
              <span className="text-lg font-bold text-white">{supporter.name}</span>
              <a
                href={`https://instagram.com/${supporter.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-300 hover:text-white transition-colors"
                dir="ltr"
              >
                @{supporter.instagram}
              </a>
            </div>
            <div className="text-left">
  {supporter.currency === 'USD' ? (
    <p className="text-xl font-bold text-white">${supporter.amount}</p>
  ) : (
    <p className="text-md font-bold text-white" dir="rtl">
      {supporter.amount.toLocaleString('fa-IR')} تومان
    </p>
  )}
</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopSupporters;
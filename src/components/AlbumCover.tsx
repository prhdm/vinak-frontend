"use client";

import React from 'react';
import Image from 'next/image';

interface AlbumCoverProps {
  coverUrl: string;
  albumName: string;
  artistName: string;
}

const AlbumCover = ({ coverUrl, albumName, artistName }: AlbumCoverProps) => {
  return (
    <div className="mb-8 flex flex-col items-center">
      <div className="relative w-[300px] h-[300px]">
        <Image
          src={coverUrl}
          alt={`${albumName} - ${artistName}`}
          width={300}
          height={300}
          className="object-cover rounded-3xl shadow-lg"
          priority
          quality={100}
          loading="eager"
          onError={(e) => {
            console.error('Error loading image:', e);
            const target = e.target as HTMLImageElement;
            target.src = '/images/placeholder.jpg';
          }}
        />
      </div>
      <h2 className="text-4xl font-bold text-white mt-4">{albumName}</h2>
      <p className="text-lg font-sf text-white">{artistName}</p>
    </div>
  );
};

export default AlbumCover;
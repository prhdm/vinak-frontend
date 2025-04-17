import React from 'react';
import Image from 'next/image';

interface AlbumCoverProps {
  coverUrl: string;
  albumName: string;
  artistName: string;
}

const AlbumCover: React.FC<AlbumCoverProps> = ({ coverUrl, albumName, artistName }) => {
  return (
    <div className="mb-4 flex flex-col items-center">
      <Image
        src={coverUrl}
        alt="Album Cover"
        width={300}
        height={300}
        className="object-cover rounded-lg shadow-lg "
      />
      <h1 className="mt-4 text-2xl text-white font-sf font-bold">{albumName}</h1>
      <p className="text-lg font-sf text-white">{artistName}</p>
    </div>
  );
};

export default AlbumCover;